#!/usr/bin/ruby
$LOAD_PATH.unshift(File.dirname(__FILE__)) unless $LOAD_PATH.include?(File.dirname(__FILE__))
require 'xcodeproj'
require 'xcodeproj/plist'
require 'json'

# Add dir to Xcode project
def ref_files(parentGroup, path, files_ref)
  Dir.entries(path).each do |sub|
    if sub != '.' && sub != '..'
      subPath = "#{path}/#{sub}";
      if File.directory?(subPath)
        subGroup = parentGroup.find_subpath(sub, true);
        subGroup.set_source_tree('SOURCE_ROOT')
        ref_files(subGroup, subPath)
      else
        file_ref = parentGroup.new_reference(subPath)
        files_ref.push(file_ref)
      end
    end
  end
end

projPath = ARGV[0]

# Read project config
configPath = File.join(projPath, 'config.json')
config = JSON.parse(File.read(configPath))

# Modify info.plist
infoPlistPath = File.join(projPath, 'App', 'info.plist')
infoPlist = Xcodeproj::Plist.read_from_path(infoPlistPath)
if config['applicationId']
  infoPlist['CFBundleIdentifier'] = config['applicationId']
end
if config['applicationName']
  infoPlist['CFBundleName'] = config['applicationName']
end
if config['versionName']
  infoPlist['CFBundleVersion'] = "#{config['versionName']}"
end
if config['versionCode']
  infoPlist['CFBundleShortVersionString'] = "#{config['versionCode']}"
end
if config['screenOrientation']
  infoPlist['UISupportedInterfaceOrientations'] = config['screenOrientation']
  infoPlist['UISupportedInterfaceOrientations~ipad'] = config['screenOrientation']
end
Xcodeproj::Plist.write_to_path(infoPlist, infoPlistPath)

# Modify Xcodeproj
xcodeprojPath = File.join(projPath, 'App.xcodeproj')
extensionName = 'extension'
project = Xcodeproj::Project.open(xcodeprojPath)

if config['target']
  project.targets.each do |target|
    target.deployment_target = config['target']
  end 
end

extensionDir = File.join(projPath, extensionName)
if File.directory?(extensionDir)
  group = project.main_group.find_subpath(extensionName, true)
  files_ref = Array.new
  ref_files(group, extensionDir, files_ref)

  project.targets.each do |target|
    target.add_file_references(files_ref)
  end  
end


project.save
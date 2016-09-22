require 'faker'
puts Faker::File.extension #=> "mp3" 
puts Faker::File.mime_type #=> "application/pdf" # Optional arguments: dir, name, extension, directory_separator 
puts Faker::File.file_name('path/to') #=> "path/to/something_random.jpg" 
puts Faker::File.file_name('foo/bar', 'baz') #=> "foo/bar/baz.zip" 
puts Faker::File.file_name('foo/bar', 'baz', 'doc') #=> "foo/bar/baz.doc" 
puts Faker::File.file_name('foo/bar', 'baz', 'mp3', '\') #=> "foo\bar\baz.mp3"

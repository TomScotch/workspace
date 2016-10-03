Lita.configure do |config|
  config.robot.name = "Lita"
  config.robot.mention_name = "@lita"
  config.robot.adapter = :slack
  config.adapters.slack.token = "xoxb-85873498419-bWpTjMaezwoeT8x6w8Tcpu4a"
  config.adapters.slack.link_names = true
  config.adapters.slack.parse = "full"
  config.adapters.slack.unfurl_links = false
  config.adapters.slack.unfurl_media = false
  config.adapters.irc.server = "192.168.0.10"
  config.adapters.irc.channels = ["#lita"]
end

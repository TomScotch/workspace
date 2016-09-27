require 'faker'
puts Faker::Color.hex_color #=> "#31a785"
puts Faker::Color.color_name #=> "yellow"
puts Faker::Color.rgb_color #=> [54, 233, 67]
puts Faker::Color.hsl_color #=> [69.87, 169.66, 225.3]
puts Faker::Color.hsla_color #=> [154.77, 232.36, 58.9, 0.26170574657729073]

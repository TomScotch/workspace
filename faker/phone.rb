require 'faker'
puts Faker::PhoneNumber.phone_number #=> "397.693.1309"
puts Faker::PhoneNumber.cell_phone #=> "(186)285-7925"
puts Faker::PhoneNumber.area_code #=> "201"
puts Faker::PhoneNumber.exchange_code #=> "208"
puts Faker::PhoneNumber.subscriber_number #=> "3873"
puts Faker::PhoneNumber.subscriber_number(2) #=> "39"
puts Faker::PhoneNumber.extension #=> "3764"


require 'faker'
puts Faker::Number.number(10) #=> "1968353479"
puts Faker::Number.decimal(2) #=> "11.88"
puts Faker::Number.decimal(2, 3) #=> "18.843"
puts Faker::Number.hexadecimal(3) #=> "e74"
puts Faker::Number.between(1, 10) #=> 7
puts Faker::Number.positive #=> 235.59238499107653
puts Faker::Number.negative #=> -4480.042585669558
puts Faker::Number.digit #=> "1"

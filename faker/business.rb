require 'faker'
puts Faker::Business.credit_card_number #=> "1228-1221-1221-1431"
puts Faker::Business.credit_card_expiry_date #=> <Date: 2015-11-11 ((2457338j,0s,0n),+0s,2299161j)>
puts Faker::Business.credit_card_type #=> "visa"


require 'faker'
#puts Faker::Date.between(2.days.ago, Date.today) #=> "Wed, 24 Sep 2014"
#puts Faker::Date.between_except(1.year.ago, 1.year.from_now, Date.today) #=> "Wed, 24 Sep 2014"
puts Faker::Date.forward(23) # => "Fri, 03 Oct 2014"
puts Faker::Date.backward(14) #=> "Fri, 19 Sep 2014"


require 'faker'
puts Faker::Time.between(DateTime.now - 1, DateTime.now) #=> "2014-09-18 12:30:59 -0700"' 
#puts Faker::Time.between(2.days.ago, Date.today, :all) #=> "2014-09-19 07:03:30 -0700" 
#puts Faker::Time.between(2.days.ago, Date.today, :day) #=> "2014-09-18 16:28:13 -0700" 
#puts Faker::Time.between(2.days.ago, Date.today, :night) #=> "2014-09-20 19:39:38 -0700" 
#puts Faker::Time.between(2.days.ago, Date.today, :morning) #=> "2014-09-19 08:07:52 -0700" 
#puts Faker::Time.between(2.days.ago, Date.today, :afternoon) #=> "2014-09-18 12:10:34 -0700" 
#puts Faker::Time.between(2.days.ago, Date.today, :evening) #=> "2014-09-19 20:21:03 -0700" 
#puts Faker::Time.between(2.days.ago, Date.today, :midnight) #=> "2014-09-20 00:40:14 -0700"
puts Faker::Time.forward(23, :morning) # => "2014-09-26 06:54:47 -0700"
puts Faker::Time.backward(14, :evening) #=> "2014-09-17 19:56:33 -0700"

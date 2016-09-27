require 'faker'
puts Faker::Commerce.color #=> "lavender"
puts Faker::Commerce.department #=> "Grocery, Health & Beauty" 
puts Faker::Commerce.department(5) #=> "Grocery, Books, Health & Beauty" 
puts Faker::Commerce.department(2, true) #=> "Books & Tools"
puts Faker::Commerce.product_name #=> "Practical Granite Shirt"
puts Faker::Commerce.price #=> "44.6"

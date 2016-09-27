require 'faker'
puts Faker::Lorem.word #=> "repellendus"
puts Faker::Lorem.words #=> ["dolores", "adipisci", "nesciunt"] 
puts Faker::Lorem.words(4) #=> ["culpa", "recusandae", "aut", "omnis"] 
puts Faker::Lorem.words(4, true) #=> ["colloco", "qui", "vergo", "deporto"]
puts Faker::Lorem.characters #=> "uw1ep04lhs0c4d931n1jmrspprf5wrj85fefue0y7y6m56b6omquh7br7dhqijwlawejpl765nb1716idmp3xnfo85v349pzy2o9rir23y2qhflwr71c1585fnynguiphkjm8p0vktwitcsm16lny7jzp9t4drwav3qmhz4yjq4k04x14gl6p148hulyqioo72tf8nwrxxcclfypz2lc58lsibgfe5w5p0xv95peafjjmm2frkhdc6duoky0aha" 
puts Faker::Lorem.characters(10) #=> "ang9cbhoa8"

puts Faker::Lorem.sentence #=> "Dolore illum animi et neque accusantium." 
puts Faker::Lorem.sentence(3) #=> "Commodi qui minus deserunt sed vero quia." 
puts Faker::Lorem.sentence(3, true) #=> "Inflammatio denego necessitatibus caelestis autus illum." 
puts Faker::Lorem.sentence(3, false, 4) #=> "Aut voluptatem illum fugit ut sit." 
puts Faker::Lorem.sentence(3, true, 4) #=> "Accusantium tantillus dolorem timor."
puts Faker::Lorem.sentences #=> ["Vero earum commodi soluta.", "Quaerat fuga cumque et vero eveniet omnis ut.", "Cumque sit dolor ut est consequuntur."] 
puts Faker::Lorem.sentences(1) #=> ["Ut perspiciatis explicabo possimus doloribus enim quia."] 
puts Faker::Lorem.sentences(1, true) #=> ["Quis capillus curo ager veritatis voro et ipsum."]

puts Faker::Lorem.paragraph #=> "Neque dicta enim quasi. Qui corrupti est quisquam. Facere animi quod aut. Qui nulla consequuntur consectetur sapiente." 
puts Faker::Lorem.paragraph(2) #=> "Illo qui voluptas. Id sit quaerat enim aut cupiditate voluptates dolorum. Porro necessitatibus numquam dolor quia earum." 
puts Faker::Lorem.paragraph(2, true) #=> "Cedo vero adipisci. Theatrum crustulum coaegresco tonsor crastinus stabilis. Aliqua crur consequatur amor una tolero sum." 
puts Faker::Lorem.paragraph(2, false, 4) #=> "Neque aut et nemo aut incidunt voluptates. Dolore cum est sint est. Vitae assumenda porro odio dolores fugiat. Est voluptatum quia rerum." 
puts Faker::Lorem.paragraph(2, true, 4) #=> "Vomito unde uxor annus. Et patior utilis sursum."

require "rubygems"
require File.dirname(__FILE__) + "/../lib/decider"

c = Decider.classifier(:spam, :ham) do |doc|
  doc.plain_text
  doc.ngrams(2..3)
  doc.stem
end

c.spam << "buy viagra, jerk" << "get enormous hot dog for make women happy"
c.ham << "check out my code on github homie" << "let's go out for beers after work"

p c.spam?("viagra for huge hot dog")
# => true
puts "term frequencies:"
puts "spam: #{c.spam.term_frequency.inspect}"
puts "ham:  #{c.ham.term_frequency.inspect}"
puts ""
p c.scores("let's write code and drink some beers")
# => {:spam=>0.0, :ham=>5.0}
p c.classify("let's write code and drink some beers")
# => :ham

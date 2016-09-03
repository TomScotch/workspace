require 'classifier'
b = Classifier::Bayes.new 'Interesting', 'Uninteresting'
b.train_interesting "here are some good words. I hope you love them"
b.train_uninteresting "here are some bad words, I hate you"
puts b.classify "I hate bad words and you" # returns 'Uninteresting'

require 'madeleine'
m = SnapshotMadeleine.new("bayes_data") {
    Classifier::Bayes.new 'Interesting', 'Uninteresting'
}
m.system.train_interesting "here are some good words. I hope you love them"
m.system.train_uninteresting "here are some bad words, I hate you"
m.take_snapshot
puts m.system.classify "I love you" # returns 'Interesting'

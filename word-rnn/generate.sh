docker exec word-rnn th sample.lua cv/$(docker exec word-rnn ls cv | tail -1) -gpuid 0 \
-temperature $1 \
-length $2 \
-primetext $3 >  sed -r 's/\  /@/g' | sed -r 's/\ //g' | sed -r 's/\@/ /g'

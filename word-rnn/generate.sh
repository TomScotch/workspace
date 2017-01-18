docker exec word-rnn th sample.lua /root/word-rnn/cv/lm_lstm_epoch29.31_1.0900.t7 -gpuid 0 \
-temperature $1 \
-length $2 \
-primetext $3

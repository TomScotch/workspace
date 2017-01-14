nvidia-docker exec ${PWD##*/} th train.lua -data_dir data/scps/ -init_from cv/lm_lstm_epoch2.48_1.1990.t7 -rnn_size 512 -num_layers 2 -dropout 0.5

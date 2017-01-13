nvidia-docker exec ${PWD##*/} th train.lua -data_dir /opt/scps/ -rnn_size 512 -num_layers 2 -dropout 0.5

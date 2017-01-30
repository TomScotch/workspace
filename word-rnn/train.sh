nvidia-docker exec ${PWD##*/} th train.lua -data_dir /opt/txt/ -rnn_size 512 -num_layers 2 -dropout 0.5
#-init_from $(ls cv | tail -1)

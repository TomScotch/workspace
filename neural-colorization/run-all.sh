nvidia-docker exec ${PWD##*/} th colorize.lua -model model.t7 -input_dir /opt/frames/ -output_dir /opt/frames/output/ -gpu 0

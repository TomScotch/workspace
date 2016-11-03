#execute commands
#exec.sh
docker exec ${PWD##*/} ./deep-regex-model/train_single.sh $full_data_directory && \
docker exec ${PWD##*/} python data_gen/generate_regex_data.py

nvidia-docker exec ${PWD##*/} \
python question_answer.py \
-image=/opt/data/$1 \
-question=$2 \
-model=$3

nvidia-docker start ${PWD##*/} ;
nvidia-docker exec ${PWD##*/} bash run-all.sh #& nvidia-docker exec ${PWD##*/} bash run-all2.sh

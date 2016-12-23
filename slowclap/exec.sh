#execute commands
#exec.sh
docker exec ${PWD##*/} slowclap --exec='$1'

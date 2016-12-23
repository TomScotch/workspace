#execute commands
#exec.sh
docker exec ${PWD##*/} sudo -u mary ./text2wav.sh $1 $2

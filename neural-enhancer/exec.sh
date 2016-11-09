#execute commands
#exec.sh

docker exec ${PWD##*/} python3 enhance.py --zoom=1 $1

#execute commands
#exec.sh

docker exec ${PWD##*/} python3 enhance.py --model=deblur --type=photo --zoom=1 $1

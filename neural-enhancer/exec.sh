#execute commands
#exec.sh

docker exec ${PWD##*/} python3 enhance.py --type=photo --model=repair --zoom=1 $1
# python3 enhance.py --model=deblur --type=photo --zoom=1 $1

#execute commands
#exec.sh

docker run --name ${PWD##*/} --net=host -it scotch/${PWD##*/} twistd -n gen-otfbot-config


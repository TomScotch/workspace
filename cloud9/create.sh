#create container
#create.sh
docker create -it --net=host -h 0.0.0.0 -p 3131:3131 --name ${PWD##*/} scotch/${PWD##*/} bash

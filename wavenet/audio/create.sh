#create container
#create.sh
nvidia-docker create --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


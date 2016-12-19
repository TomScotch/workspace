#create container
#create.sh
docker create --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


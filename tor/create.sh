#create container
#create.sh
docker create -p 9050:9050 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


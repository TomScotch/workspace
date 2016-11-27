#create container
#create.sh
docker create -p 8080:8080 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


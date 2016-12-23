#create container
#create.sh
docker create -p 59125:59125 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


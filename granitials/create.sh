#create container
#create.sh
docker create -p 3000:3000 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


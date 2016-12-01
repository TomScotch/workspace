#create container
#create.sh
docker create -p 8080:8080 -p 8000:8000 -p 35250:35250 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


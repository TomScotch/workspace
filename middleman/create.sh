#create container
#create.sh
docker create -p 4567:4567 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/}


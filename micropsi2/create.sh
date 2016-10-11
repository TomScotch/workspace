#create container
#create.sh
docker create -p 6543:6543 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/}


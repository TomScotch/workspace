#create container
#create.sh
docker create --net=host -p 1377:1377 -t -i --name ${PWD##*/} scotch/${PWD##*/}


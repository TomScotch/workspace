#create container
#create.sh
docker create --net=host -p 8888:8888 -t -i --name ${PWD##*/} scotch/${PWD##*/}


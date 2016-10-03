#jupyter
#create.sh
docker create --net=host -p 8888:888 -p 8887:8887 -t -i --name ${PWD##*/} scotch/${PWD##*/}


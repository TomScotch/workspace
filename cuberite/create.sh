#create container
#create.sh
docker create -p 8000:8000 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/}


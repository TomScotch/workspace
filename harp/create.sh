#create container
#create.sh

docker create -p 9000:9000 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/}

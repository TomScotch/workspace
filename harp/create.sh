#create container
#create.sh

docker create -p 9119:9119 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/}

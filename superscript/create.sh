#create container
#create.sh

docker create -t -i -l mongodb:mongodb --name ${PWD##*/} scotch/${PWD##*/}

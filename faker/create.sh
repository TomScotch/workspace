#create container
#create.sh

docker create -t -i -v $PWD/scripts/:/opt/scripts/ --name ${PWD##*/} scotch/${PWD##*/}

#create container
#create.sh
docker create -v /media/scps/:/opt/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/}


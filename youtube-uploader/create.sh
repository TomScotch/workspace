#create container
#create.sh
docker create -v /media/scps/:/opt/scps/ -t -i --name ${PWD##*/} scotch/${PWD##*/}


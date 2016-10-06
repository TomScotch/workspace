#create container
#create.sh
docker create -v /media/scps/:/opt/scp/ -t -i --name ${PWD##*/} scotch/${PWD##*/}


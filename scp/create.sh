#create container
#create.sh

docker create -t -i -v /media/scps/:/opt/scps/ --name ${PWD##*/} scotch/${PWD##*/} bash

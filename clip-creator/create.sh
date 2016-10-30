#create container
#create.sh

docker create -v /media/scps/:/opt/scps/ -v /media/scp-images/:/opt/images/ -t -i --name ${PWD##*/} scotch/${PWD##*/}

#create container
#create.sh

docker create -v /media/scps/:/opt/scps/ -v /media/electricsheep/:/opt/electricsheep/ -t -i --name ${PWD##*/} scotch/${PWD##*/}

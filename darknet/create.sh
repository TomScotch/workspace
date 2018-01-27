#create container
#create.sh
docker create -v /home/tomscotch/workspace/darknet/pics/:/opt/darknet/pics -v /media/scps/:/opt/scps/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/}


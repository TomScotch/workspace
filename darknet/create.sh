#create container
#create.sh
nvidia-docker create -v /media/scps/:/opt/scps/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/}


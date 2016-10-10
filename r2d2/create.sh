#create container
#create.sh

docker create -t -i -v /home/pi/workspace/r2d2/:/opt/ --name ${PWD##*/} scotch/${PWD##*/}

#create container
#create.sh

docker create -t -i -v /home/pi/workspace/scp/:/data/ --link redis:db --name ${PWD##*/} scotch/${PWD##*/}

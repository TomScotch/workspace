#create container
#create.sh

docker create -t -i -v /media/scps/:/opt/scps/ --name ${PWD##*/} scotch/${PWD##*/} redis-server --port 6379 > /dev/null

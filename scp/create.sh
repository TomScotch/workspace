#create container
#create.sh

docker create -t -i -v /home/pi/workspace/scp/:/data/ --name ${PWD##*/} scotch/${PWD##*/} redis-server --port 6379

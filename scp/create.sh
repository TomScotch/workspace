#create container
#create.sh

docker create -t -i -v /media/scps/:/data/scp --name ${PWD##*/} scotch/${PWD##*/} redis-server --port 6379

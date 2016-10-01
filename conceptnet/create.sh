#create container
#create.sh

docker create -p 80:10054 --net=host -v /media/conceptnet/data/:/root/conceptnet/data/ -t -i --name ${PWD##*/} scotch/${PWD##*/}

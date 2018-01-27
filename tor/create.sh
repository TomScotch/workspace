#create container
#create.sh
#docker create -p 9050:9050 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash
docker create -p 9050:9050 --cap-add NET_ADMIN   --dns 0.0.0.0 -t -i --name tor-router flungo/tor-router bash

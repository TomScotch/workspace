#create container
#create.sh
docker create -t -i --net=host -p 4200:4200 --name ${PWD##*/} scotch/${PWD##*/} python web/server.py


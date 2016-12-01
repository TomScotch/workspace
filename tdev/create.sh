#create container
#create.sh
docker create -p 4242:4242 -t -i --name ${PWD##*/} scotch/${PWD##*/}


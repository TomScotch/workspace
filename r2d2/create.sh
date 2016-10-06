#create container
#create.sh

docker create -t -i --name ${PWD##*/} scotch/${PWD##*/} python r2d2.py

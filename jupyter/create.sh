#jupyter
#create.sh
docker create --net=host -p 443:443 -p 8888:888 -p 8887:8887 -p 8890:8890 -t -i --name ${PWD##*/} scotch/${PWD##*/}


#create container
#create.sh

docker create -t -i -v /home/tomscotch/workspace/r2d2/:/opt/ --name ${PWD##*/} scotch/${PWD##*/}

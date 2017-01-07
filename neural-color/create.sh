#create container
#create.sh
docker create -v /home/tomscotch/workspace/data/myvideo/:/opt/myvideo/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


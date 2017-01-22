nvidia-docker create -v /home/tomscotch/workspace/data:/opt/data/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


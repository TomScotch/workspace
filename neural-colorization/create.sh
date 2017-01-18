nvidia-docker create --net=host -v /home/tomscotch/workspace/data/frames/:/opt/frames/ -t -i --name ${PWD##*/} scotch/${PWD##*/} bash

nvidia-docker create -v /home/tomscotch/workspace/midi/:/opt/soundcube/music/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash && r2d2


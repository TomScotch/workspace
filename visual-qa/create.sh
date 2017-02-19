nvidia-docker create -v /home/tomscotch/workspace/visual-qa/:/opt/data/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash && r2d2


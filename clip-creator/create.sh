docker create -v /media/sheep/:/opt/sheep/ -v /media/scps/:/opt/scps/ -t -i --name ${PWD##*/} scotch/${PWD##*/}

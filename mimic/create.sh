docker create -t -v /media/scps/:/opt/scps -w /opt/ --device=/dev/snd --name ${PWD##*/} scotch/${PWD##*/}

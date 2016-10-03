docker create -t -v /media/scps/:/opt/scps -w /opt/ -v /dev/snd:/dev/snd --device=/dev/snd --name ${PWD##*/} scotch/${PWD##*/}

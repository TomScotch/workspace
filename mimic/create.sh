docker create -t -v /media/scps/text/:/opt/text -w /opt/ -v /dev/snd:/dev/snd --device=/dev/snd --name ${PWD##*/} scotch/${PWD##*/}

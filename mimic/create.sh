docker create -t -v /home/pi/workspace/mimic/text/:/opt/text/ -v /media/scps/:/opt/scps -w /opt/ --device=/dev/snd --name ${PWD##*/} scotch/${PWD##*/}

docker create -t -v /home/tomscotch/workspace/hts/text/:/opt/text/ -v /media/scps/:/opt/scps -w /opt/ --device=/dev/snd --name ${PWD##*/} scotch/${PWD##*/} bash

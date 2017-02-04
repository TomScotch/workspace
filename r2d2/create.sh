docker create -t -i -v /home/tomscotch/workspace/r2d2/:/opt/ -w /opt/ --device=/dev/snd --name ${PWD##*/} scotch/${PWD##*/}

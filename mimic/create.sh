docker create -t -v $PWD/text/:/opt/text -v /dev/snd:/dev/snd --device=/dev/snd --entrypoint="bin/mimic" --name ${PWD##*/} scotch/${PWD##*/}

docker create -t -v $PWD/text/:/opt/text --workdir /opt/ -v /dev/snd:/dev/snd --device=/dev/snd --entrypoint="mimic/bin/mimic" --name ${PWD##*/} scotch/${PWD##*/}

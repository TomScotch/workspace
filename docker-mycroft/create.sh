nvidia-docker create --device /dev/snd:/dev/snd --privileged  --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash

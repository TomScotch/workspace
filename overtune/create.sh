#create container
#create.sh
docker create -v /dev/snd:/dev/snd --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash


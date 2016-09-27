#create container
#create.sh

docker create -t -i -v /dev/snd:/dev/snd --device=/dev/snd --name ${PWD##*/} scotch/${PWD##*/} python r2d2.py

docker create --net=host -t -i -v '~/jme3/BasicGame/dist/':/data --name ${PWD##*/} scotch/${PWD##*/} bash


docker create -p 8971:8971 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash

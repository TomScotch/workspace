#build image
#build.sh

nvidia-docker build -t scotch/${PWD##*/} .

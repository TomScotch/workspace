#build image
#build.sh

docker build -t scotch/${PWD##*/} .

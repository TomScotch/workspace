nvidia-docker images | grep scotch/${PWD##*/} > .tmp
if [ -s .tmp ]
then
nvidia-docker rmi -f scotch/${PWD##*/}
fi
rm .tmp

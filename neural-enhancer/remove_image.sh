x=$(docker images | grep scotch/${PWD##*/})
if [ $x ]
then
nvidia-docker rmi -f scotch/${PWD##*/} 
fi

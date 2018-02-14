x=$(docker images | grep scotch/${PWD##*/})
if [ $x ]
then
docker rmi -f scotch/${PWD##*/} 
fi

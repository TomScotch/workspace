docker images | grep scotch/${PWD##*/} > .tmp
if [ -s .tmp ]
then
docker rmi -f scotch/${PWD##*/}
fi
rm .tmp

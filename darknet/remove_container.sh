docker ps -a | grep ${PWD##*/} > .tmp
if [ -s .tmp ]
then
docker rm -f ${PWD##*/}
fi
rm .tmp

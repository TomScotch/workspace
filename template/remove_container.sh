x=$(docker ps -a | grep ${PWD##*/})
if [ $x ]
then
docker rm -f ${PWD##*/}
fi

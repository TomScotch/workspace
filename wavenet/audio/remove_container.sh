nvidia-docker ps -a | grep ${PWD##*/} > .tmp
if [ -s .tmp ]
then
nvidia-docker rm -f ${PWD##*/}
fi
rm .tmp


x=$(docker ps -a | grep ${PWD##*/})
if [ "$x" != "" ] ; then
nvidia-docker rm -f ${PWD##*/} 
fi

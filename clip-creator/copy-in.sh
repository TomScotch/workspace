if [ $1 ]
then
if [ $2 ]
then
nvidia-docker cp $1 ${PWD##*/}:$2
fi
fi

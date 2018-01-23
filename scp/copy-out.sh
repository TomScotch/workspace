if [ $1 ]
then
nvidia-docker cp ${PWD##*/}:/$1 .
fi

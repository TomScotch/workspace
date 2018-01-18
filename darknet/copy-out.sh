if [ $1 ]
then
docker cp ${PWD##*/}:/$1 .
fi

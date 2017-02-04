if [ $1 ]
then
docker cp ${PWD##*/}:/$1 . && r2d2
fi

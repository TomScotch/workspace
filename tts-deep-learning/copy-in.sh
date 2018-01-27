if [ $1 ]
then
if [ $2 ]
then
docker cp $1 ${PWD##*/}:$2 #&& r2d2
fi
fi

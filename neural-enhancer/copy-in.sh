if [ $1 ]
then
#if [ $2 ]
#then
docker cp $1 ${PWD##*/}:"/opt/"$1
#fi
fi

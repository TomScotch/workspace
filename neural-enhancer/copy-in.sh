if [ $1 ]
then
docker cp $1 ${PWD##*/}:"/opt/neural-enhancer/pics/"$1
fi
rm $1

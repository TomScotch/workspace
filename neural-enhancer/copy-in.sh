if [ $1 ]
then
docker cp $1 ${PWD##*/}:"/opt/neural-enhancer/pics/"
fi
#rm $1

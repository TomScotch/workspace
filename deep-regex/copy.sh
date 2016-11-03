echo $2 > .tmp
if [ -s .tmp  ]
then
docker cp $1 ${PWD##*/}:$2
else
docker cp $1 ${PWD##*/}:/opt/
rm .temp
fi

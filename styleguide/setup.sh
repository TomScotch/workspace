docker ps -a | grep ${PWD##*/} > .tmp
if [ -s .tmp ]
then
./remove_container.sh
fi
rm .tmp
./build.sh && ./create.sh && ./start.sh

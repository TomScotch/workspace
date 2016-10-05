docker ps -a | grep ${PWD##*/} >> tmp
if [ -s tmp ]
then
./remove_container.sh
fi
./build.sh && ./create.sh && ./start.sh && ./exec.sh && rm tmp

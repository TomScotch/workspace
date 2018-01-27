x=$(docker ps -a | grep ${PWD##*/})
if [ "$x" != "" ] ; then ./remove_container.sh ; fi
./build.sh && ./create.sh && ./start.sh #&& r2d2

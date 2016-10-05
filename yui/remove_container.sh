test = docker ps -a | grep ${PWD##*/}
if $test == ""
docker rm -f ${PWD##*/}
fi

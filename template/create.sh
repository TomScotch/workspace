#create container
#create.sh
docker ps -a | grep ${PWD##*/} >> tmp
if [ -s tmp ]
then
./remove_container.sh
fi
rm tmp
docker create -t -i --name ${PWD##*/} scotch/${PWD##*/}


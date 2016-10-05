#create container
#create.sh
echo "" > .tmp
docker ps -a | grep ${PWD##*/} >> .tmp
if [ -s .tmp ]
then
./remove_container.sh
fi
rm .tmp
docker create -v /media/scps/:/opt/scp/ -t -i --name ${PWD##*/} scotch/${PWD##*/}


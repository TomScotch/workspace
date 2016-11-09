echo "usage: ./run.sh term folder file"
 for i in $(find $2 -name $3) ; do echo $i $(cat $i | grep "$1"); done | grep "$1"

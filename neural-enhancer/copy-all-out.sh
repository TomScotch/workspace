for x in $( sudo docker exec ${PWD##*/} find /opt/ -maxdepth 1 -type f ) ; do ./copy-out.sh $x ; done

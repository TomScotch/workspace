x="scp-";for f in $(cat /media/scps/.uploaded) ; do  if [ "$f" == "$x" ] ; then echo $f ; fi ; x=$(echo $f) ; done

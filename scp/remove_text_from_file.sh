x=$(cat $1 | grep $2) ; if [ "$x" != "" ] ; then sed $2 < $1 > $1 ; fi

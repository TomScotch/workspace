f=$(find . -name '$1') && x=$(cat $f | grep '$2') ; if [ "$x" != "" ] ; then sed '$2' < $f > $f ; fi

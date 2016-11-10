 for i in $(find $2 -name $3)
 do
  x=$(cat $i | grep $1)
    if [ ! "$x" == "" ];then
        echo $i
    fi
  done

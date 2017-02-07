for f in /media/scps/*.html
  do
    name=${f#/media/scps/} ;
    name=${name%.*} ;
    name2=$(echo $name | sed s/^scp-0/scp-/g) ;
    img=$(cat $f | grep http://scp-wiki.wdfiles.com/local--files/$name2)
    img=${img#*src\=\"}
    img=${img%\" style*}
    img=${img%\" style\=*}
    img=${img%\" width*}
    img=$(echo $img | sed s/style\=\"//g)
    img=${img%width\:*}
    img=${img%width\:*}
    img=${img%class*}
    img=${img%width\:*}
    img=${img%width\=\"*}
    img=${img%width\:*}
    img=${img%width\:*}
    img=$(echo $img | sed s/\"//g)
    img=${img%width\:*}
    img=${img%alt\=*}
    img=${img%width*}
    if [ ! -d "/media/scps/"$name ] ; then
      mkdir /media/scps/$name
    fi
      if [ -n "$img" ] ; then
	x=$(echo $img  | sed s/" "/""/g | sed s/"("/""/g | sed s/")"/""/g | sed s/"%"/""/g | sed s/"-"/""/g)
	x=${x#*.*.*/*/}
	x=$(echo $x  | sed s/"\/"/""/g)
	if [ -f "/media/scps/$name/$x" ] ; then echo 'skipped ' $x ; else curl $img > /media/scps/$name/$x ; fi
      fi
done

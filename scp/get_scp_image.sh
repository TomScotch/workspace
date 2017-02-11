for f in /media/scps/*.html
  do
    name=${f#/media/scps/} ;
    name=${name%.*} ;
    name2=$(echo $name | sed s/^scp-0/scp-/g) ;
    img=$(cat $f | grep http://scp-wiki.wdfiles.com/local--files/$name2)
    img=${img#*src=\"}
    img=$(echo $img | sed s/\"//g)
    img=${img%%width=*width=*width=*width=*}
    img=${img%%width=*}
    img=${img%%width=*}
    img=${img##htref=*}
    img=${img%%title=*}
    img=${img%%class=*}
    img=${img%%style=*}
    img=${img%%height=*}
    img=${img%%alt=*}
    if [ ! -d "/media/scps/"$name ] ; then
      mkdir /media/scps/$name
    fi
      z=$(ls /media/scps/$name);
      if  [ $z == "" ] ; then
	if [ -n "$img" ] ; then
          x=$(echo $img  | sed s/" "/""/g | sed s/"("/""/g | sed s/")"/""/g | sed s/"%"/""/g | sed s/"-"/""/g)
	  x=${x#*.*.*/*/}
	  x=$(echo $x  | sed s/"\/"/""/g)
	    if [ -f "/media/scps/$name/$x" ] ; then echo 'skipped ' $x ; else curl $img > /media/scps/$name/$x ; mogrify -resize '1024x1024' /media/scps/$name/$x ; fi
        fi
      else
	echo "nothing to do for /media/scps/"$name
      fi
done

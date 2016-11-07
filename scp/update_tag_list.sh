for f in /media/scps/*.txt
  do
    x=$(cat $f | grep '.jpg')
      if [ "$x" ] ;
        then
	echo $x";"$f >> tag_list.txt
      fi
    x=$(cat $f | grep '.png')
      if [ "$x" ] ;
        then
        echo $x";"$f >> tag_list.txt
      fi
    x=$(cat $f | grep '.jpeg')
      if [ "$x" ] ;
        then
        echo $x";"$f >> tag_list.txt
      fi
    x=$(cat $f | grep '.bmp')
      if [ "$x" ] ;
        then
        echo $x";"$f >> tag_list.txt
      fi
    x=$(cat $f | grep '.tiff')
      if [ "$x" ] ;
        then
        echo $x";"$f >> tag_list.txt
      fi
  done

cat tag_list.txt | wc -l

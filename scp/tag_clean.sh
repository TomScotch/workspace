for e in tag_list.txt
  do
    for f in /media/scps/*.txt
      do
        sed -e s/$e//g -i $f
      done
  done

echo "done removing tags"

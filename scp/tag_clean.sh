for f in $(find /media/scps/*.txt -type f -print | xargs grep "$(cat list_tag.txt)")
  do
    f=$(echo $f | tr ";" "\n")
    file= $f[0] ; exp= $f[1]
    sed -e s/$exp//g -i $file
  done

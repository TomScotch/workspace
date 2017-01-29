for f in /media/scps/*.html
  do
  name=${f#/media/scps/}
  name=${name%.*}
  if [ -f "/media/scps/"$name".png" ]; then
  echo "skipped" $name
  else
  ./exec.sh http://www.scp-wiki.net/$name $name.png && echo $name
  fi
done

./start.sh && \

for f in /media/scps/*.html
do
  name=${f#/media/scps/}
  name=${name%.*}
  if [ -d "/media/scps/"$name ]; then
  echo "skipped" $name
  else
  name2=$(echo $name | sed s/^scp-0/scp-/g)
  mkdir /media/scps/$name
  ./exec.sh http://www.scp-wiki.net/$name2 $name/$name.png
  echo $name2
  fi
done

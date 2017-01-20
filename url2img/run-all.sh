for f in /media/scps/*.html
  do
  name=${f#/media/scps/}
  name=${name%.*}
  ./exec.sh http://www.scp-wiki.net/$name $name.png
done

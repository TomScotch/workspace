./start.sh && \
cd /media/scps/ && \
for f in $(ls -d */ -1 ) ; do
 cd /media/scps/
  x=$(ls $f | wc -l);
  if test $x -le 0 ; then
    cd /home/tomscotch/workspace/url2img/
    name=${f#/media/scps/}
    name=${name%.*}
    name=${name%\/}
    name2=$(echo $name | sed s/^scp-0/scp-/g)
    ./exec.sh http://www.scp-wiki.net/$name2 $f$name.png
    echo $f$name.png
  fi ;
done
echo "continue with : gtts"

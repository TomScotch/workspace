./start.sh && \
cd /media/scps/ && \
for f in $(ls *.txt -1) ; do
 cd /media/scps/
  if [ -f $f".png" ]; then
    echo $name".png existiert bereits"
  else
    cd /home/tomscotch/workspace/url2img/
    name=${f#/media/scps/}
    name=${name%.*}
    name=${name%\/}
    name2=$(echo $name | sed s/^scp-0/scp-/g)
    name3="${name2%%.*}"
    ./exec.sh http://www.scp-wiki.net/printer--friendly//$name3 $f.png
    echo $f.png
  fi
done

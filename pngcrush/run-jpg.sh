cd /media/scps/ &&
for f in $(find /media/scps/ *.jpg | grep jpg); do
cd /media/scps/ &&
f=$(echo ${f#.});
 if [ -f $f.crush ]; then
    echo "skipped : "$f" crushed already"
  else
    cd /home/tomscotch/workspace/pngcrush/ && bash enhancejpg.sh $f $f.crush
    echo "enhanced - "$f.crush
 fi
done
r2d2

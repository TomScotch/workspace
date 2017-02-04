for f in $(find /media/scps/ -name *.png); do
  if [ -f $f.crush ]; then
    echo "skipped : "$f" crushed already"
  else
   bash crunchpng.sh $f $f.crush
   echo "crushed - " $f.crush
  fi
done
r2d2

for f in $(find /media/scps/ -name *.jpg); do
  if [ -f $f.crush ]; then
    echo "skipped : "$f" enhanced already"
  else
   bash enhancejpg.sh $f $f.crush
   echo "enhanced - " $f.crush
  fi
done
r2d2


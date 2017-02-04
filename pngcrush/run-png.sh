for f in $(find /media/scps/ -name *.png); do
  if [ -f $f.crush ]; then
    echo "skipped : "$f" crushed already"
  else
   bash crunchpng.sh $f $f.crush
   echo "crushed - " $f.crush
  fi
done

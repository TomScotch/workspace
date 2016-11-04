for f in /media/scps/*.txt
do
  x=$(< $f)
  z=$(python scripts/remove_non_ascii.py $x)
  echo $z > $f
done

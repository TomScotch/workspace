for f in /opt/scps/*.txt
do
  x=$(< $f)
  z=$(python remove.py $x)
  echo $x > $f
fi
done

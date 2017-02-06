for f in $(find /media/scps/* -name *.jpg)
do
recoverjpeg -f $f $f
done

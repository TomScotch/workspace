for f in $(find /media/scps/* -name *.jpg)
do
recoverjpeg -f $f $f
done

for f in $(find /media/scps/* -name *.jpeg)
do
recoverjpeg -f $f $f
done

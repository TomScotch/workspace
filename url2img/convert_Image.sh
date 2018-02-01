for x in $(ls /media/scps/*.png -1) ; do
if [ -f $f".jpg" ]; then
echo $f "skipped" ;
else
convert $x $x.jpg ;
fi
done

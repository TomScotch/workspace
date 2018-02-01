for x in $(ls /media/scps/*.wav -1) ; do
if [ -f $f".mp3" ]; then
echo $f "skipped"
else
ffmpeg -i $x $x.mp3 ;
echo $x.mp3 "erstellt"
fi
done

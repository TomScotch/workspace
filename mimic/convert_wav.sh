for f in $(ls /media/scps/*.wav -1) ; do
if [ -f $f".mp3" ] ; then
echo $f".mp3 skipped"
else
ffmpeg -i $f $f.mp3
echo $f.mp3 "erstellt"
fi
done

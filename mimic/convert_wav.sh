for x in $(ls /media/scps/*.wav -1) ; do
ffmpeg -i $x $x.mp3 ;
echo $x.mp3
; done

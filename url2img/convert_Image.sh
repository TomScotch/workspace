for x in $(ls /media/scps/*.png -1) ; do
convert $x $x.jpg
; done

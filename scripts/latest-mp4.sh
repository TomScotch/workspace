x=$(ls -1 /media/scps/*.mp4 | tail -1);x=${x##*/};x=${x%.html.*};echo $x

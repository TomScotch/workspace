for f in /opt/scps/*.wav
  do
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
        files=(/opt/electricsheep/*.mp4)
        N=${#files[@]}
        ((N=RANDOM%N))
        randf=${files[$N]}
    ffmpeg -i $randf -i $f $f.mp4
  fi
done

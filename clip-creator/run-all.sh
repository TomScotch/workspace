for f in /opt/scps/*.wav
  do
    if [ -f "$f.ogv" ]
      then
        echo "skipped : " $f " : already existing"
    else
        files=(/opt/electricsheep/*.mp4)
        N=${#files[@]}
        ((N=RANDOM%N))
        randf=${files[$N]}
    ffmpeg -i $randf -i $f $f.ogv
  fi
done

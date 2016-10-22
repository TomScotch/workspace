for f in /opt/scps/*.wav
  do
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing .mp4"
    else
        files=(/opt/electricsheep/*.mp4)
        N=${#files[@]}
        ((N=RANDOM%N))
        randf=${files[$N]}
    ffmpeg -i $randf -i $f -c:v copy -c:a aac -strict experimental $f.mp4
  fi
done

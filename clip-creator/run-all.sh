for f in /opt/scps/*.wav
  do
    if [ -f "$f.mov" ]
      then
        echo "skipped : " $f " : already existing"
    else
     ffmpeg -i $f -f -stream_loop -1 -i $(shuf -n1 -e /opt/sheep/*.mp4) \
     -c:v libx264 -preset medium \
     -shortest -fflags +genpts $f.mp4
    fi
done

for f in /opt/scps/*.wav
  do
    if [ -f "$f.mov" ]
      then
        echo "skipped : " $f " : already existing"
    else
     ffmpeg -i $f -loop 1 -i $(shuf -n1 -e /opt/sheep/*) -r 15 -s 640x480 \
     -c:v libx264 -crf 18 -tune stillimage -preset medium \
     -shortest $f.mov
    fi
done

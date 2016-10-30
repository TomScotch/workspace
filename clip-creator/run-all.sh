for f in /opt/scps/*.wav
  do
    if [ -f "$f.mov" ]
      then
        echo "skipped : " $f " : already existing"
    else
     ffmpeg -i $f -f image2 -loop 1 -i $(shuf -n1 -e /opt/sheep/*.png) -r 15 \
     -c:v libx264 -crf 18 -tune stillimage -preset medium \
     -shortest $f.mov
    fi
done

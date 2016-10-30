for f in /opt/scps/*.wav
  do
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
     ffmpeg -i $f -f image2 -loop 1 -i /opt/scp.jpg -r 15 -s 640x480 \
     -c:v libx264 -crf 18 -tune stillimage -preset medium \
     -shortest $f.mov
    fi
done

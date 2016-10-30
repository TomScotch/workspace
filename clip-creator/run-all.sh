for f in /opt/scps/*.wav
  do
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
     d=$(sox $f -n stat 2>&1 | sed -n 's#^Length (seconds):[^0-9]*\([0-9.]*\)$#\1#p')
     ffmpeg -f image2 -t $d -i /opt/images/image-%03d.png -vcodec libx264 -preset superfast /opt/images/tmp.mp4
     ffmpeg -i /opt/images/tmp.mp4 -i $f -preset superfast $f.mp4
     rm /opt/scp-images/tmp.mp4
  fi
done

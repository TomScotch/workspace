for f in /opt/scps/*.wav
  do
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
     ffmpeg -f image2 -r 30 -i /opt/images/image-%03d.png -i $f -vcodec libx264 $f.mp4
  fi
done

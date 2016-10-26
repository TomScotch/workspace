for f in /opt/scps/*.wav
  do
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
      ffmpeg -i /opt/scp.flv -i $f -shortest $f.mp4
  fi
done

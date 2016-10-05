for f in /opt/scps/*.wav
  do
    if [ -f "$f.mkv" ]
      then
        echo $f"already existing"
    else
        ffmpeg -i /opt/scp.mp4 -i $f -c copy $f.mkv
        echo $f"created"
    fi
  done

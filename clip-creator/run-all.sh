for f in /opt/scps/*.wav
  do
  if [$(./scripts/free-usb.sh)>=1000]
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
     ffmpeg -i $f \
     -stream_loop -1 \
     -i /opt/sheep/scp.avi \
     -c:v libx264 -preset superfast \
     -shortest -fflags +genpts $f.mp4
    fi
  fi
done

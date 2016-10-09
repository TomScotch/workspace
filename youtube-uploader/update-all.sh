for f in /opt/scps/*.txt
  do
    desc=$(cat $f)
      name=${f#/opt/scps/}
      name=${name%.txt.wav.mkv}
      python3 update_video.py --video-id=$name --tags=$desc
  done

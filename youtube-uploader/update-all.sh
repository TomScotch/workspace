for f in /opt/scp/*.mkv
  do
    descfile=${f%.wav.mkv}
    desc=$(< $descfile)
    name=${f#/opt/scp/}
    name=${name%.txt.wav.mkv}
      python update_video.py \
        --video-id="$name" \
        --tags="$desc"
  done

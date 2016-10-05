for f in /opt/scps/*.wav
do
  ffmpeg -i /opt/scp.mp4 -i $f -c copy $f.mkv
done

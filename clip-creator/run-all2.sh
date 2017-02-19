for f in /media/scps/*.mp3
  do
  name=${f#/media/scps/}
  name=${name%.html.*}
  test=$(grep $name /media/scps/.uploaded)
    if [ -f "$f.mp4" ] ; then
        echo "skipped : " $f " : already existing"
    else
       x=$(ls -1 /media/scps/$name/ | head -1 | tail -1) ;
          ffmpeg \
	  -hwaccel cuvid \
          -i $f \
          -f image2 \
          -loop 1 \
          -i /media/scps/$name/$x \
          -c:v h264_cuvid  \
          -shortest \
	  -preset fast \
	  -vcodec h264_nvenc \
	  $f.mp4
   fi
done
echo "continue with youtube uploaded"

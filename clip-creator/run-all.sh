for f in /media/scps/*.mp3
  do
  name=${f#/media/scps/}
  name=${name%.html.*}
#  test=$(grep $name /media/scps/.uploaded)
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
#      if [ "$test" == "" ];then
         x=$(ls -1 /media/scps/$name/ | head -1 | tail -1)
        ffmpeg \
          -i $f \
          -f image2 \
          -loop 1 \
          -i /media/scps/$name/$x \
          -r 15 \
          -c:v libx264 \
          -crf 18 \
          -tune stillimage \
          -preset ultrafast \
          -shortest \
	  $f.mp4
 #     else
 #       echo $name 'already uploaded'
 #     fi
   fi
done
echo "continue with youtube uploader"

for f in /opt/scps/*.mp3
  do
  name=${f#/opt/scps/}
  name=${name%.html.*}
  test=$(grep $name /opt/scps/.uploaded)
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
      if [ "$test" == "" ];then
         x=$(ls -1 /opt/scps/$name/ | head -1 | tail -1)
       if [ -f "$x.crush" ] ; then
         ffmpeg \
          -i $f \
	  -f image2 \
	  -loop 1 \
	  -i /opt/scps/$name/$x.crush \
	  -r 15 \
	  -c:v libx264 \
	  -crf 18 \
	  -tune stillimage \
	  -preset ultrafast \
	  -shortest \
	   $f.mp4
      else
        ffmpeg \
          -i $f \
          -f image2 \
          -loop 1 \
          -i /opt/scps/$name/$x \
          -r 15 \
          -c:v libx264 \
          -crf 18 \
          -tune stillimage \
          -preset ultrafast \
          -shortest \
	  $f.mp4
     fi
   else
      echo $name 'already uploaded'
   fi
  fi
done
echo "continue with youtube uploader"

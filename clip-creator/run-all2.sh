
./start.sh;

for f in /media/scps/*.mp3
  do
  name=${f#/media/scps/}
  name=${name%.html.*}
  test=$(grep $name /media/scps/.uploaded)
    if [ -f "$f.mp4" ] ; then
       echo "skipped : " $f ": already existing"
    else
         ./exec.sh "ffmpeg \
          -i /media/scps/$name.html.dump.txt.wav.mp3 \
          -f image2 \
          -i /media/scps/$name.html.dump.txt.png.jpg \
	  /media/scps/$name.html.dump.txt.mp4"
   fi
done
echo "continue with youtube uploaded"

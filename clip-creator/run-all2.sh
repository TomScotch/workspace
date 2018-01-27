
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
          -i /opt/scps/$name.html.dump.txt.mp3 \
          -f image2 \
          -i /opt/scps/$name.html.dump.txt.png.jpg \
	  /opt/scps/$name.html.dump.txt.mp4"
   fi
done
echo "continue with youtube uploaded"

for f in /media/scps/*.html; do
name=${f#/media/scps/
name=${name%.*}
  if [ -f "/media/scps/"$name"/"$name.png ]; then
   crunchpng.sh /media/scps/$name/$name.png /media/scps/$name/$name.png.crush && mv /media/scps/$name/$name.png.crush  /media/scps/$name/$name.png && \
   echo "crushed - " $f
  fi
done

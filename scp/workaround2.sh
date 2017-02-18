
for f in $(cat /media/scps/.fail); do \
  echo "removing" $f; \
  rm /media/scps/$f/* ; \
  rm /media/scps/$f.html.dump.txt.mp3.mp4 ;\
done
  echo "" > /media/scps/.fail
  echo "continue with url2img and clip-creator"

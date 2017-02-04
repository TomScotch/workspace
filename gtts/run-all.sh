for f in /media/scps/*.txt; do
  name=${f#/media/scps/}
  name=${name%.html.*}
  echo $name
  if [ -f $f".mp3" ]; then
    echo $name".mp3 existiert bereits"
  else
    gtts-cli -l 'en' -f '/media/scps/'$name'.html.dump.txt' -o '/media/scps/'$name'.html.dump.txt.mp3'
  fi
done
echo "continue with clip-creator"

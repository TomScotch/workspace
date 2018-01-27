for f in /media/scps/*.txt; do
  echo $f
  name=${f#/media/scps/}
  name=${name%.html.*}
  if [ -f $f".wav" ]; then
    echo $f".wav existiert bereits"
  else
    touch $f.wav && mimic -o $f.wav -f $f
  fi
done
./convert_wav.sh

for f in $(ls /media/scps/*.txt -1) ; do
  echo $f
  name=${f#/media/scps/}
for f in /opt/scps/*.txt; do
  echo $f
  name=${f#/opt/scps/}
  name=${name%.html.*}
  if [ -f $f".wav" ]; then
    echo $f".wav existiert bereits"
  else
    touch $f.wav && ./speak.sh $f $f.wav
  fi
done
    touch $f.wav && ./mimic/hts/runvoice.sh -o $f.wav -f $f
  fi
done
./convert_wav.sh

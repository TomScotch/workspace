for f in /opt/scps/*.txt; do
  echo $f
  name=${f#/opt/scps/}
  name=${name%.html.*}
  if [ -f $f".wav" ]; then
    echo $f".wav existiert bereits"
  else
    touch $f.wav && mimic/bin/mimic -voice slt -o $f.wav -f $f
  fi
done

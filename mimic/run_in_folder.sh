
for f in /opt/text/*.txt; do
    echo $f
  if [ -f $f".wav" ]
  then
    echo $f".wav existiert bereits"
  else
    touch $f.wav && mimic/bin/mimic -voice slt -o $f.wav -f $f
  fi
done

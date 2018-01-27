
for f in /opt/text/*.txt; do
    echo $f
  if [ -f $f".wav" ]
  then
    echo $f".wav existiert bereits"
  else
    touch $f.wav && mimic/bin/mimic -voice http://www.festvox.org/flite/packed/flite-2.0/voices/cmu_us_clb.flitevox -o $f.wav -f $f
  fi
done

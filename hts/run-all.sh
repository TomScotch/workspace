for f in /opt/scps/*.txt; do
  echo $f
  name=${f#/opt/scps/}
  name=${name%.html.*}
  if [ -f $f".wav" ]; then
    echo $f".wav existiert bereits"
  else
   echo -n $(cat $f) > $f.stream
   bash /opt/hts/runvoice.sh $f.stream
   mv $f.stream.wav $f.wav
   rm $f.stream
  fi
done

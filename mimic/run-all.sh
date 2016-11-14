
for f in /opt/scps/*.txt; do
  echo $f
  name=${f#/opt/scps/}
  name=${name%.html.*}
  test=$(grep $name /opt/scps/.log)
  if [ "$test" == "" ];then
    if [ -f $f".wav" ]
      then
       echo $f".wav existiert bereits"
    else
       touch $f.wav && mimic/bin/mimic -voice slt -o $f.wav -f $f
     fi
   else
       echo $f 'bereits hochgeladen"
   fi
done

for f in /media/scps/*.html
do
    if [ -f "$f".dump ]
      then
        echo "skipped : " $f " : already existing"
    else
      w3m -dump -O ASCII $f > $f.dump
   fi
done

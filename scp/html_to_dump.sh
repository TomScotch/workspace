for f in /media/scps/*.html
do
    if [ -f "$f".dump ]
      then
        echo "skipped : " $f " : already existing"
    else
     # lynx -dump -nolist $f > $f.dump
       w3m -dump -O ASCII $f > $f.dump
     # elinks -dump -no-references $f > $f.dump
   fi
done

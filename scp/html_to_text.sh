for f in /media/scps/*.html
do
    if [ -f "$f.txt" ]
      then
        echo "skipped : " $f " : already existing"
    else
      w3m -dump -display_charset ASCII $f > $f.txt
    fi
done

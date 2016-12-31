for f in $(ls /media/scps/*.txt) ; do \

touch $f.clean && \
tr -cd '[:alnum:][:space:]' && \
mv $f.clean $f ; \

echo $f " - is clean now" ;

done

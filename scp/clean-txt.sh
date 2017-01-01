for f in $(ls /media/scps/*.txt) ; do \
echo $f ;
touch $f.clean && \
cat $f | tr -cd '[:alnum:][:space:]' > $f.clean && \
mv $f.clean $f ; \
done

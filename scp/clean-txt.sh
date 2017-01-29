for f in $(ls /media/scps/*.txt) ; do \
echo $f ;
touch $f.clean && \
sed --in-place '/png/d' $f.clean && \
sed --in-place '/rating/d' $f.clean && \
sed --in-place '/jpg/d' $f.clean && \
sed --in-place '/jpeg/d' $f.clean && \
sed --in-place '/bmp/d' $f.clean && \
cat $f | tr -cd '[:alnum:][:space:]'  | head -n -2 > $f.clean && \
mv $f.clean $f ; \
done
echo 'finished cleaning scp text files'

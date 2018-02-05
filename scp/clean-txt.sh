for f in $(ls /media/scps/*.dump) ; do
	sed --in-place '/.png/d' $f && \
	sed --in-place '/rating/d' $f && \
	sed --in-place '/.jpg/d' $f && \
	sed --in-place '/.jpeg/d' $f && \
	sed --in-place '/.bmp/d' $f && \
	cat $f | tr -cd '[:alnum:][:space:]'  | head -n -2 > $f.clean ;
	mv $f.clean $f.txt ;
	echo $f.txt " is clean" ;
done ;
echo 'finished cleaning scp text files'

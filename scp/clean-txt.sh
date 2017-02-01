for f in $(ls /media/scps/*.txt) ; do \
  echo $f ;

	sed --in-place '/.png/d' $f && \
	sed --in-place '/rating/d' $f && \
	sed --in-place '/.jpg/d' $f && \
	sed --in-place '/.jpeg/d' $f && \
	sed --in-place '/.bmp/d' $f && \

	cat $f | tr -cd '[:alnum:][:space:]'  | head -n -2 > $f.clean && \
	mv $f.clean $f ; \
done
echo 'finished cleaning scp text files'

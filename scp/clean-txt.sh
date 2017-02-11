for f in $(ls /media/scps/*.txt) ; do
  if [ ! -f $f.clean ] ; then
     echo $f ;
	sed --in-place '/.png/d' $f && \
	sed --in-place '/rating/d' $f && \
	sed --in-place '/.jpg/d' $f && \
	sed --in-place '/.jpeg/d' $f && \
	sed --in-place '/.bmp/d' $f && \
	cat $f | tr -cd '[:alnum:][:space:]'  | head -n -2 > $f.clean && \
	cp $f.clean $f ; \
  else
    echo "skipped"$f
  fi
done
echo 'finished cleaning scp text files'

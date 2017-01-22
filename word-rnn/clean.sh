for f in $(ls *.txt) ; do \
echo $f ;
touch $f.clean && \
#cat $f | tr -cd '[:alnum:][:space:]' > $f.clean && \
cat $f | sed -e 's/^[[:space:]]*//' > $f.clean && \
mv $f.clean $f ; \
done

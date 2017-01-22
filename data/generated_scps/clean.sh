for f in $(ls *.txt) ; do

echo $f ;
touch $f.clean && \

#cat $f | tr -cd '[:alnum:][:space:]' > $f.clean && \

cat $f | sed 's/" "/""/' > $f.clean && \
#cat $f | sed 's/" "/""/' > $f.clean && \
#cat $f | sed 's/@/" "/' > $f.clean && \

mv $f.clean $f ;
done

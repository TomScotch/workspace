for f in $(ls /media/scps/*.txt) ; do \

touch $f.clean && \
sed 's/"\"/x/g' $f > $f.clean && \
mv $f.clean $f && \

touch $f.clean && \
sed 's/<//g' $f > $f.clean && \
mv $f.clean $f && \

touch $f.clean && \
sed 's/>//g' $f > $f.clean && \
mv $f.clean $f && \

touch $f.clean && \
sed 's/@//g' $f > $f.clean && \
mv $f.clean $f && \

touch $f.clean && \
sed 's/?/x/g' $f > $f.clean && \
mv $f.clean $f ; \

done

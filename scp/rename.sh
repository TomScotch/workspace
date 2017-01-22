rm *2fHistory && \
for f in $(ls index.html?*_*f_* -1) ; do
    	name=$(index.html?page=) || name=${f#index.html?} && \
	cat $f > $name.html && \
	echo $f ;
done

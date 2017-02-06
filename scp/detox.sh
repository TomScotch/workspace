cd /media/scps/ && \
for f in $(ls -1 -d */) ; do
  detox -r $f ;
done

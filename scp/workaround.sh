for f in $(./find-zero.sh) ; do
x=$(ls -1 $(echo ${f%.html*})) ;
y=$(find /media/scps/ -name $x) ;
echo "removing" $y ; rm $y ;
done && \
rm $(./find-zero.sh) && \
echo "continue with url2img and clip-creator"

for f in $(./find-zero.sh) ; do x=$(ls -1 $(echo ${f%.html*})) ; rm $(find /media/scps/ -name $x) ; done && \
rm $(./find-zero.sh) && \
echo "continue with url2img and clip-creator"

echo "website : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.html') && \
echo "extract : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.dump') && \
echo "text : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.txt') && \
echo "audio : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.wav') && \
echo "video : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.mp4') && \
echo "uploaded : " $(cat /media/scps/.uploaded |wc -l)
x=$(cat /media/scps/.fail |wc -l) ; echo "failed : $x"
f=$( cd /home/tomscotch/workspace/scp/;./find-zero.sh) && if [ "$f" != "/media/scps/.fail" ] ; then echo $f ; fi

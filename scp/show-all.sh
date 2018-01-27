echo "website : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.html') && \
echo "extract : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.dump') && \
echo "text : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.txt') && \
echo "wav : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.wav') && \
echo "mp3 : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.mp3') && \
echo "mp4 : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.mp4') && \
echo "png : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.png') && \
echo "jpg : " $(bash /home/tomscotch/workspace/scripts/count_files.sh '/media/scps/*.jpg') && \
./find-zero.sh

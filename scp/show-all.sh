echo "website : " $(bash /home/pi/workspace/scripts/count_files.sh '/media/scps/*.html') && \
echo "extract : " $(bash /home/pi/workspace/scripts/count_files.sh '/media/scps/*.dump') && \
echo "text : " $(bash /home/pi/workspace/scripts/count_files.sh '/media/scps/*.txt') && \
echo "audio : " $(bash /home/pi/workspace/scripts/count_files.sh '/media/scps/*.wav') && \
echo "video : " $(bash /home/pi/workspace/scripts/count_files.sh '/media/scps/*.mp4') && \
echo "Uploaded : " $(cat /media/scps/.log |wc -l)

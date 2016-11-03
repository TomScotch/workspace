echo "website : " $(./count_files.sh '/media/scps/*.html') && \
echo "extract : " $(./count_files.sh '/media/scps/*.dump') && \
echo "text : " $(./count_files.sh '/media/scps/*.txt') && \
echo "audio : " $(./count_files.sh '/media/scps/*.wav') && \
echo "video : " $(./count_files.sh '/media/scps/*.mp4')

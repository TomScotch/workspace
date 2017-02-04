# start container
cd /home/tomscotch/workspace/scp/ && \
./start.sh && \

# download html files from 0 - 3000
./get_scps.sh && \

# grab article images
./get_scp_image.sh && \

# clean up html with w3m dump
./html_to_dump.sh && \

# cut file down
./dump_to_text.sh  && \

# remove unfit characters
# that prevent upload
./clean-txt.sh && \

#stop container
./stop.sh

echo "continue with : url2img - pngcrush - gtts - clip-creator - youtube-uploader"

# start container
cd /home/tomscotch/workspace/scp/ && \
./start.sh && \

# download html files from 0 - 3000
./get_scps.sh && \

# clean up html with w3m dump
./html_to_dump.sh && \

# cut file down
./dump_to_text.sh  && \

# remove unfit characters
# that prevent upload
./clean-txt.sh && \

# grab article images
./get_scp_image.sh && \

#remove zero size files
rm $(./find-zero.sh) && \

# convert unfit images
./convert.sh && \

#repair files
./recoverjpeg.sh && \

#detox filenames
#./detox.sh

#stop container
./stop.sh && \

echo "continue with : url2img"

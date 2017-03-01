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
./clean-txt.sh && \

# grab article images
./get_scp_image.sh && \

#remove zero size files
#find /media/scps/ -type f -size 0 -exec rm {} \; && \

#stop container
./stop.sh;

echo "run rm $(./find-zero.sh) and continue with : url2img";

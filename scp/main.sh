# start container
cd /home/tomscotch/workspace/scp/ && \
./start.sh && \

# download html files from 0 - 3000
./old_get_scps.sh && \

# clean up html with w3m dump
./html_to_dump.sh && \

# cut file down
./dump_to_text.sh  && \

B# remove unfit characters
# that prevent upload
./clean-txt.sh && \

#stop container
./stop.sh && \

#show progress
bash /home/tomscotch/workspace/scp/show-all.sh && \

#text to speech
cd ../hts && \
./start.sh && \
./exec-run-all.sh && \
./stop.sh

#show progress
bash /home/tomscotch/workspace/scp/show-all.sh && \

#create videos
cd ../clip-creator/ && \
./start.sh && \
./exec-run-all.sh && \
./stop.sh && \

#show progress
bash /home/tomscotch/workspace/scp/show-all.sh && \

#upload videos
cd ../youtube-uploader/ && \
./start.sh && \
./exec-run-all.sh && \
./stop.sh && \

# show progress
bash /home/tomscotch/workspace/scp/show-all.sh

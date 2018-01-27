# start container
cd /home/tomscotch/workspace/scp/ && \
./start.sh && \

# download html files from 0 - 3000
./get_scps.sh && \

# clean up html with w3m dump
./html_to_dump.sh && \
./dump_to_text.sh  && \
./clean-text.sh && \

#stop container
./stop.sh && \

#text to speech
cd ../mimic && \
./start.sh && \
./exec-run-all2.sh && \
./stop.sh

#create videos
cd ../clip-creator/ && \
./start.sh && \
./exec-run-all.sh && \
./stop.sh && \

#upload videos
#cd ../youtube-uploader/ && \
#./start.sh && \
#./exec-run-all2.sh && \
#./stop.sh && \

# show progress
#bash /home/tomscotch/workspace/scp/show-all.sh

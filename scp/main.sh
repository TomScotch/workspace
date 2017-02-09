# start container
cd /home/tomscotch/workspace/scp/ && \
./start.sh && \

# download scp data
./run-all.sh && \

#stop container
./stop.sh && \

#get page image
cd ../url2img && \
./start.sh && \
./run-all.sh && \
./stop.sh && \

#text to speech
cd ../gtts && \
./start.sh && \
./run-all.sh && \
./stop.sh && \

#create videos
cd ../clip-creator/ && \
./start.sh && \
./exec-run-all.sh && \
./stop.sh && \

# workaround failed videos
cd ../scp/ && \
./workaround.sh && \

#get page image
cd ../url2img && \
./start.sh && \
./run-all.sh && \
./stop.sh && \

#create videos
cd ../clip-creator/ && \
./start.sh && \
./exec-run-all.sh && \
./stop.sh && \

#upload videos
cd ../youtube-uploader/ && \
./start.sh && \
./exec-run-all.sh && \
./stop.sh && \

# show progress
clear && bash /home/tomscotch/workspace/scp/show-all.sh
r2d2

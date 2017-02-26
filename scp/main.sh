# download scp data
./run-all.sh && \

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
./run-all2.sh && \
find /media/scps/ -type f -size 0 -exec rm {} \;
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

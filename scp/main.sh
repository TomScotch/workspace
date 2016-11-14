# start container
cd /home/pi/workspace/scp/ && \
./start.sh && \

# download html files from 0 - 3000
./get_scps.sh && \

# clean up html with w3m dump
./html_to_dump.sh && \

# cut file down
./dump_to_text.sh  && \

# transfer text to redis db
./text_to_redis.sh && \

#stop container
./stop.sh && \

#show progress
./home/pi/workspace/scp/show-all.sh && \

#text to speech
cd ../mimic && \
./start.sh && \
./run-all.sh && \
./stop.sh

#show progress
./home/pi/workspace/scp/show-all.sh && \

#create videos
cd ../clip-creator/ && \
./start.sh && \
./exec-run-all.sh && \
./stop.sh && \

#show progress
./home/pi/workspace/scp/show-all.sh && \

#upload videos
cd ../youtube-uploader/ && \
./start.sh && \
./exec-run-all.sh && \
./stop.sh

# show progress
./home/pi/workspace/scp/show-all.sh && \

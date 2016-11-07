# build create start
./setup.sh && \

# download html files from 0 - 3000
./get_scps.sh && \

# clean up html with w3m dump
./html_to_dump.sh && \

# cut file down
./dump_to_text.sh  && \

# create or update tag list
./update_tag_list.sh

# remove artifacts
./tag_clean.sh && \

# transfer text to redis db
./text_to_redis.sh && \

# output redis entry for all html files
./test_scps.sh && \

# delete zero size files
./delete_zero_files.sh && \

#show overall progress
./show-all.sh && \

#text to speech
cd ../mimic && \
./start.sh && \
./outfile.sh && \

#show overall progress
./show-all.sh && \

#create videos
cd ../clip-creator/ && \
./start.sh && \
./clip-creator/exec-run-all.sh

#show overall progress
./show-all.sh && \

# build create start
./setup.sh && \

# download html files from 0 - 3000
./get_scps.sh && \
./delete_zero_files.sh && \
./show_all.sh && \

# clean up html with w3m dump
./html2txt.sh && \
./delete_zero_files.sh && \
./show_all.sh && \

# cut file down
./process_scps.sh  && \
./delete_zero_files.sh && \
./show_all.sh && \

# remove html and css tags
./tag_remover.sh && removetags.sh && \
./delete_zero_files.sh && \
./show_all.sh && \

# transfer text to redis db
./text_to_redis.sh && \

# output redis entry for all html files
./test_scps.sh

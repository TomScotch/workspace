nvidia-docker exec ${PWD##*/} \
cd /opt/autocolor/ && movie2frames.sh WhiteZombie.mp4 frames png && \
/opt/autocolor/ && python autocolorization.py && \
cd /opt/autocolor/ && find ./frames -name "*.png" |sort > frames.txt && \
cd /opt/autocolor/ && mkdir new_frames && \
cd /opt/autocolor/ && [lua call]  && \
cd /opt/autocolor/ && avconv -f image2 -r 24 -i new_frames/%d.png -i audio.mp3 -r 24 -vcodec libx264 -crf 16 video.mp4

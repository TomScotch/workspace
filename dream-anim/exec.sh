docker exec ${PWD##*/} python dreamer.py --input /data/myvideo/video.mp4 --output /data/myvideo --extract 1 && \
python dreamer.py --input /data/myvideo --output /data/myvideo/frames && \
python dreamer.py --input /data/myvideo/frames --output /data/myvideo/deepdreamvideo.mp4 --create 1 -gpu 0
#mencoder mf://data/myvideo/frames/*.png -mf w=800:h=600:fps=5:type=jpg -ovc copy -oac copy -o /data/myvideo/deepdream.avi

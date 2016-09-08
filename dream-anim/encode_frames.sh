run -it  -v /home/pi/workspace/data/myvideo:/data/myvideo --rm scotch/dream-anim python dreamer.py --input /data/myvideo/frames --output /data/myvideo/deepdreamvideo.mp4 --create 1 -gpu 0

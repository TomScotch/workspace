python dreamer.py --input /data/myvideo/video.mp4 --output /data/myvideo --extract 1 &&
python dreamer.py --input /data/myvideo --output /data/myvideo/frames &&
python dreamer.py --input /data/myvideo/frames --output /data/myvideo/deepdreamvideo.mp4 --create 1 -gpu 0

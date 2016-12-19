#docker exec ${PWD##*/} python dreamer.py --input /data/myvideo/video.mp4 --output /data/myvideo --extract 1
docker exec ${PWD##*/} python dreamer.py --input /data/myvideo --output /data/myvideo/frames
#docker exec ${PWD##*/} python dreamer.py --input /data/myvideo/frames --output /data/myvideo/deepdreamvideo.mp4 --create 1

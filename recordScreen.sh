 ffmpeg -f x11grab -r 25 -s 1280x720 -i :0.0+0,24 -threads 0 $(date +%s).avi

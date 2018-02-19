 ffmpeg -hwaccel cuvid -c:v h264_cuvid -i $1 -vf scale_npp=1280:720 -c:v h264_nvenc new-$1

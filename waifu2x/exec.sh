nvidia-docker run -v /home/tomscotch/workspace/data/images/:/opt/images/ scotch/waifu2x th waifu2x.lua -force_cudnn 1 -m scale -scale 2 -i $1 -o $1.png

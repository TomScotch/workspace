docker build -t waifu2x .
nvidia-docker run -p 8812:8812 waifu2x th web.lua
nvidia-docker run -v `pwd`/images:/images waifu2x th waifu2x.lua -force_cudnn 1 -m scale -scale 2 -i /images/miku_small.png -o /images/output.png

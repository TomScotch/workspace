nvidia-docker run -v $PWD/ComputeCache:/root/.nv/ComputeCache waifu2x th scotch/waifu2x.lua --help
nvidia-docker run -p 8812:8812 scotch/waifu2x th web.lua
nvidia-docker run -v `pwd`/images:/images scotch/waifu2x th waifu2x.lua -force_cudnn 1 -m scale -scale 2 -i /images/miku_small.png -o /images/output.png

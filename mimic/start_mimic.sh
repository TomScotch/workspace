docker run -itd --name mimic -v /dev/snd:/dev/snd --device=/dev/snd --entrypoint="bin/mimic" scotch/mimic

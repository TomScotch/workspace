docker run -it -v /dev/snd:/dev/snd --device=/dev/snd --name alan --net=host --restart=on-failure:9 --privileged scotch/alan python /alan/alan.py

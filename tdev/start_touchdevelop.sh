docker run --restart=on-failure:9 -v /home/pi/workspace/data/:/data --name tdev -p 4242:4242 -it --privileged --net=host scotch/tdev

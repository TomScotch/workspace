docker run   --device=/dev/video0 -v /home/pi/workspace/data/motion:/var/lib/motioneye -i -t -p 8081:8081 -p 8765:8765 --net=host --name motioneye scotch/motioneye

docker run -d --device=/dev/v4l/by-id/usb-046d_0819_559186E0-video-index0 --name motion -p 8191:8191 --net host -v /home/pi/workspace/data/motion:/data/motion --privileged scotch/motion

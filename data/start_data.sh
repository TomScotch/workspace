docker run -d --name data --net=host -v /home/pi/workspace/data/:/opt -p 99:99 --restart=on-failure:3 scotch/data

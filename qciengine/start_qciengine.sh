docker run --name qciengine -p 5002:5002 -d --net=host --restart=on-failure:9 -v /home/pi/workspace/qciengine:/data/ scotch/qiciengine

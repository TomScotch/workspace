sudo docker rm tor-router ;sudo docker run -d   --name tor-router   --cap-add NET_ADMIN   --dns 127.0.0.1 -p 9050:9050 flungo/tor-router

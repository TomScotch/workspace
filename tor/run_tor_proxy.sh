sudo docker run -d   --name tor-router   --cap-add NET_ADMIN   --dns 127.0.0.1   -p 9050:9050   -p 53:5353/udp   flungo/tor-router 

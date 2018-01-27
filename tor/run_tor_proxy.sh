<<<<<<< HEAD
sudo docker run -d --name tor-router --cap-add NET_ADMIN --dns 0.0.0.0 -p 9050:9050 flungo/tor-router
=======
sudo docker rm tor-router ;sudo docker run -d   --name tor-router   --cap-add NET_ADMIN   --dns 127.0.0.1 -p 9050:9050 flungo/tor-router
>>>>>>> 9013625fa7dfa277da93987e28b9d825bbb20413

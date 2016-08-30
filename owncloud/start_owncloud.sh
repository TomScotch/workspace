docker run --restart=on-failure:9 -d --link mysql:mysql -p 80:80 --name owncloud armv7/armhf-owncloud:8.1

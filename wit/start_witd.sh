docker run -v /dev/snd:/dev/snd --device=/dev/snd --name wit -p 9877 --net=host -d scotch/wit ./witd

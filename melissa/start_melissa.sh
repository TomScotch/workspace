docker rm -f melissa && docker run -it -v /dev/snd:/dev/snd --device=/dev/snd --name melissa scotch/melissa

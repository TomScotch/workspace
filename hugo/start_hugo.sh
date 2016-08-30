docker run --name hugo -it -p 1313:1313 -v /home/pi/workspace/data/www/:/www/ hypriot/rpi-hugo server --bind=0.0.0.0 -w -D --theme=hyde


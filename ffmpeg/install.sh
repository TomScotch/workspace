echo "deb http://www.deb-multimedia.org wheezy main non-free" >> /etc/apt/sources.list
echo "deb-src http://www.deb-multimedia.org wheezy main non-free" >> /etc/apt/sources.list
apt-get update
apt-get install deb-multimedia-keyring -y
apt-get update
apt-get install -y ffmpeg

apt-get install -y pv curl python-pip unzip hdparm
curl -O https://raw.githubusercontent.com/hypriot/flash/master/$(uname -s)/flash
chmod +x flash
mv flash /usr/local/bin/flash


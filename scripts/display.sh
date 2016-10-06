wget https://archive.raspbian.org/raspbian.public.key -O - | sudo apt-key add -
echo "deb http://archive.raspbian.org/raspbian jessie main contrib non-free">>/etc/apt/sources.list
apt-get update && apt-get install ffmpeg -y

sudo apt-get update
sudo apt-get install x11vnc

x11vnc -usepw -forever -display :0

echo "consoleblank=0 \
" >> /boot/cmdline.txt

echo " \
hdmi_force_hotplug=1 \
hdmi_drive=2 \
hdmi_group=1 \
hdmi_mode=19 " >> /boot/config.txt

echo " \
  [Unit] \
  Description=Start X11VNC \
  After=multi-user.target  \
  [Service] \
  Type=simple \
  ExecStart=/usr/bin/x11vnc -display :0 -auth guess -forever -loop -noxdamage -repeat -rfbauth /etc/x11vnc.pass -rfbport 5900 -shared \
  [Install] \
  WantedBy=multi-user.target\
" >> /lib/systemd/system/x11vnc.service

systemctl enable x11vnc.service
sudo x11vnc -storepasswd /etc/x11vnc.pass

#sudo ./start.sh ;  sudo ./copy-in.sh $1 /opt/ ; rm $1 ;
sudo docker exec ${PWD##*/} python3 enhance.py --model=deblur --type=photo --zoom=1 /opt/$1
#sudo docker exec ${PWD##*/} rm /opt/$1  ; sudo ./copy-all-out.sh

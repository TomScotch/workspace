#sudo ./start.sh ;  sudo ./copy-in.sh $1 /opt/ ;
sudo docker exec ${PWD##*/} python3 enhance.py --model=repair --type=photo --zoom=1 /opt/$1
#sudo ./copy-all-out.sh

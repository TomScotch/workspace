for f in /opt/scps/*.txt
  do
    sed -e s/$1//g -i /media/scps/*.txt
  done

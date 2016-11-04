sed -e s/'?I will'/'I will'/g -i /media/scps/*.txt
sed -e s/'2000animal'/'animal'/g -i /media/scps/*.txt

for f in /opt/scps/*.txt
  do
    sed -e s/'$1'/'$2'/g -i /media/scps/*.txt
  done

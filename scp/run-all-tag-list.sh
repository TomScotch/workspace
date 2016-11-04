sed -e s/'?I will'/'I will'/g -i /media/scps/*.txt
sed -e s/'2000animal'/'animal'/g -i /media/scps/*.txt
x=$(< tag_list.txt)
for tag in $x
do
  ./tag_clean.sh $tag
done

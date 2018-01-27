for x in $(ls /media/scps/*.txt -1) ; 
do
nl -b a $x | sort -k1,1nr | sed '1,8 d' | sort -k1,1n | sed 's/^ *[0-9]*\t//' > $x.clean ; mv $x.clean $x;
echo $x;
 done

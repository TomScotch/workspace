for x in $(ls /media/scps/*.txt -1) ;
do

        name=${x#/media/scps/scp-}
        name=${name%.*}
        name=${name%\/}
        name2=$(echo $name | sed s/^scp-/scp-/g)
        name3=$(echo $name2 | sed 's/^0*//')
        name4="${name3%%.*}"
	echo $name4
        sed '/SCP$name4/,$!d' $x > $x.clean
        sed '/Footnotes/,$d' $x > $x.clean
	head -n -5 $x.clean > $x
	rm $x.clean
done

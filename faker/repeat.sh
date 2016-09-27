for ((i=1;i<=$2;i++))

do
 ./run.sh $1.rb >> $1.log
done
cat $1.log

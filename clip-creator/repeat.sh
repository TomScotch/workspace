for ((i=1;i<=$2;i++))

do
 ./run_faker.sh $1.rb >> $1.log
done
cat $1.log

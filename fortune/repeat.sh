for ((i=1;i<=$1;i++))

do
 ./run.sh /usr/games/fortune >> fortune.txt
done
cat fortune.txt

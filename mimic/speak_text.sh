
for var in "$@"
do
    docker exec mimic bin/mimic -t $var

done

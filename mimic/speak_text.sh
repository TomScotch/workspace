
for var in "$@"
do
    docker exec mimic bin/mimic -voice slt -t $var
done

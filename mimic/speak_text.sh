
for var in "$@"
do
    docker exec mimic mimic/bin/mimic -voice slt -t $var
done

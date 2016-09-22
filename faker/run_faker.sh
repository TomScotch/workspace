for var in "$@"
do
    docker run -it --rm scotch/faker ruby $var
done

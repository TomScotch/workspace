
for var in "$@"
do
    docker exec mimic mimic/bin/mimic -voice http://www.festvox.org/flite/packed/latest/voices/cmu_us_clb.flitevox -t $var
done

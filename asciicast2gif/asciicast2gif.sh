# $1 = json input
# $2 = gif output
docker run --rm -v $PWD:/data asciinema/asciicast2gif -s 2 -t solarized-dark $1 $2

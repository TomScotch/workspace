x=$(< $1)
z=$(python scripts/remove_non_ascii.py $x)
echo $z > $1

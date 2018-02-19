cd $1 ;for x in $(ls *.jpg -1); do enhance --type=photo --zoom=1 --model=repair $x && mv ${x::-4}"_ne1x.png" $x ; done

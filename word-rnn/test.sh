for f in $(docker exec word-rnn ls -1 cv) ;
  do
  for ((c=9;c>=1;c--)) ;
     do
     docker exec word-rnn th sample.lua \
     cv/$f \
     -gpuid 0 \
     -temperature 0.$c \
     -length 500 |  sed -r 's/\  /@/g' | sed -r 's/\ //g' | sed -r 's/\@/ /g' > $c-$f.txt
  done
done

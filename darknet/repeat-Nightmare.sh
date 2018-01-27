# Úse Ṕarameter
# $1 = file to use as origin
# $2 = repeat nightmare per layer
# $3 $4 = layer to begin and end

num=00;

# resize image with image magick
mogrify -resize 512 $1

# dream of electricsheep
for i in $(seq $3 $4); do
  for x in $(seq 1 $2) ; do
    num=$((num+1)) ;
    ./opt/darknet nightmare cfg/vgg-conv.cfg vgg-conv.weights $1 $i  ;
    mv $1 results/$num.jpg ;
    mv *.jpg $1;
  done
done

# convert images to gif animation and open with eye of mate
mv $1 results/$num.jpg ; convert -delay 30 -loop 0 results/*.jpg $1.gif ; eom $1.gif

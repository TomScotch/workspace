for f in $(find /media/scps/* -name *.gif) ; do
convert -resize '1024x1024' $f $f.jpeg && rm $f && echo "converted and resized "$f" - to jpeg";
done

for f in $(find /media/scps/* -name *.jpeg) ; do
convert -resize '1024x1024' $f $f && rm $f && echo "converted and resized "$f" - to jpeg";
done

for f in $(find /media/scps/* -name *.jpg) ; do
convert -resize '1024x1024' $f $f && rm $f && echo "converted and resized "$f" - to jpeg";
done

for f in $(find /media/scps/* -name *.png) ; do
convert -resize '1024x1024' $f $f.jpeg && rm $f && echo "converted and resized "$f" - to jpeg";
done

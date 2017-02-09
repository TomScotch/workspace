for f in $(find /media/scps/* -name *.gif)
do
convert -resize '1024x1024' $f $f.jpeg && rm $f && echo "converted and resized "$f" - to jpeg"
done

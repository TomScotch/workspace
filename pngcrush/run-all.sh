for f in /media/scps/*.png; do
  if [ -f $f".crush" ]; then
    echo "crushing - " $f "skipped"
  else
   ./crunchpng.sh $f $f.crush && mv $f.crush $f && \
   echo "crushed - " $f
  fi
done

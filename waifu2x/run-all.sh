for f in /media/scps/*.png; do
  if [ -f $f".waifu" ]; then
    echo "enhancing - " $f "skipped"
  else
   ./upscale-denoise-image.sh $f 1
  echo "enhanced - " $f
  fi
done

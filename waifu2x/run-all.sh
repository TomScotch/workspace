for f in /media/scps/*.png; do
  if [ -f $f".waifu" ]; then
    echo "enhancing - " $f "skipped"
  else
   ./upscale-denoise-image.sh $f $f.waifu 1
  echo "enhanced - " $f
  fi

 if [ -f $f".waifu.crush" ]; then
  echo "crushing - " $f "skipped"
 else
   curl -X POST -s --form "input=@"$1.waifu";type=image/png" http://pngcrush.com/crush > $1.waifu.crush
   echo "crushed - " $f
 fi
done

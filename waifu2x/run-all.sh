for f in /media/scps/*.png; do
  if [ -f $f".waifu" ]; then
    echo "skipped - " $f
  else
   ./upscale-denoise-image.sh $f $f.waifu 1
  echo "enhanced - " $f
  fi

 if [ -f $f".waifu.crush" ]; then
  echo "skipped - " $f
 else
   curl -X POST -s --form "input=@"$1.waifu";type=image/png" http://pngcrush.com/crush > $1.waifu.crush
   echo "crushed - " $f
 fi
done

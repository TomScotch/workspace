for f in $(ls -1 /data/todo/1) ; do
  python ./colorization/colorize.py -img_in /data/todo/1/$f -img_out /data/todo/1/$f --gpu 0
done

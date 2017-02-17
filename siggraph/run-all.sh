for f in $(ls -1 frames) ; do
  echo 'coloring - ' $f
  ./run.sh frames/$f
done

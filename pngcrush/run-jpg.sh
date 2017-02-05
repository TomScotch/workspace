cd /media/scps/ && for f in $(find . -name *.jpg | grep jpg)
do
  cd /media/scps/;
    x=${f#.\/};
      if [ -f $x.crush ]; then
        echo "skipped : "$x" crushed already"
      else
       # cd /home/tomscotch/workspace/pngcrush/ && bash enhancejpg.sh $f $f.crush
        echo "enhanced - /media/scps/"$x.crush
      fi
done

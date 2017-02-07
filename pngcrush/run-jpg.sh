cd /media/scps/ && for f in $(find . -name *.jpg)
do
  cd /media/scps/;
    x=${f#.\/};
      if [ -f /media/scps/$x.crush ]; then
        echo "skipped : /media/scps/"$x" crushed already"
      else
        cd /home/tomscotch/workspace/pngcrush/ && bash enhancejpg.sh /media/scps/$x /media/scps/$x.crush && \
	cp  /media/scps/$x.crush  /media/scps/$x && \
        echo "enhanced - /media/scps/"$x.crush
      fi
done

for f in /media/scps/scp-****.html.txt
do
  name=${f#/media/scps/}
  docker exec cobe cobe learn "/opt/scps/$name"
  docker cp cobe:/opt/cobe.brain /home/pi/workspace/cobe/
  docker cp cobe:/opt/cobe.brain-journal /home/pi/workspace/cobe/
done

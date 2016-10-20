for f in /media/scps/*.txt
do
  name=${f#/media/scps/}
  docker exec darknet ./darknet rnn train cfg/rnn.cfg -file "/opt/scps/$name"
done
 docker cp darknet:/opt/rnn.backup /home/pi/workspace/darknet/

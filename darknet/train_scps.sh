name=""
for f in /media/scps/scp-****.html.txt
do
  name=${f#/media/scps/}
  docker exec darknet ./darknet rnn train cfg/rnn.cfg -file "/opt/scps/$name"
  docker cp darknet:/opt/rnn.backup /home/pi/workspace/darknet/
done
 docker cp darknet:/opt/rnn.backup /home/pi/workspace/darknet/

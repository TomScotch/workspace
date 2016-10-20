name=""
for f in /media/scps/scp-****.html.txt
do
  name=${f#/media/scps/}
  docker exec darknet ./darknet rnn train cfg/rnn.cfg -file "/opt/scps/$name"
  docker cp darknet:/opt/*.weights /home/pi/workspace/darknet/
done

#echo Hello world |
#docker run --rm -i mjansche/tts-tutorial-sltu2016 festival/bin/text2wave |
#aplay
echo $1 |
docker run --rm -i mjansche/tts-tutorial-sltu2016 festival/bin/text2wave > output.wav

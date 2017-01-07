docker run \
  -it \
  --rm \
  -v /home/ubuntu:/data ozzyjohnson/tts \
  bash -c 'espeak -f $1 --stdout > $1.wav'

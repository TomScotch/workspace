docker run \
  -it \
  --rm \
  -v /home/ubuntu:/data ozzyjohnson/tts \
  bash -c 'espeak $1 --stdout > $2.wav'

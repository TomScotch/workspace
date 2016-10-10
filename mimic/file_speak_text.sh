for var in "$@"
do
./exec_outfile_text.sh "tmp" "$var" && aplay /home/pi/workspace/mimic/text/tmp.wav
done

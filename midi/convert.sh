for f in $( ls /home/tomscotch/workspace/midi/*.mid) ; do echo $f ; timidity $f -Or -o $f.wav ; done

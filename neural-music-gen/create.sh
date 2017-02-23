nvidia-docker create  -v /home/tomscotch/workspace/midi/:/opt/musicgen/datasets/YourMusicLibrary --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash && r2d2

for f in /opt/scps/*.wav
  do
    if [ -f "$f.mkv" ]
      then
        echo $f"already existing"
    else
        N=42
        a=( /opt/electricsheep/* )
        randf=()
        for((i=0;i<N && ${#a[@]};++i)); do
          ((j=RANDOM%${#a[@]}))
          randf+=( "${a[j]}" )
          a=( "${a[@]:0:j}" "${a[@]:j+1}" )
        done
        ffmpeg -i $randf -i $f -c copy $f.mkv
        echo $f"created"
    fi
  done

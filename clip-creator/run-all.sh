for f in /opt/scps/*.wav
  do
  name=${f#/opt/scps/}
  name=${name%.html.*}
  test=$(grep $name /opt/scps/.uploaded)
  x=$(bash /opt/free-usb.sh)
  echo $x
  if (( "$x" >= "1000" )) ; then
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
      if [ "$test" == "" ];then
       ffmpeg -i $f \
       #-stream_loop -1 \
       -loop_input \
       -f image2 \
       -i /opt/scps/$name.png
       -preset ultrafast \
       -shortest \
       -fflags \
       +genpts \
       $f.mp4
      else
	echo $name 'already uploaded'
      fi
    fi
  fi
done

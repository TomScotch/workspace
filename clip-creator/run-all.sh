for f in /opt/scps/*.mp3
  do
  name=${f#/opt/scps/}
  name=${name%.html.*}
  test=$(grep $name /opt/scps/.uploaded)
    if [ -f "$f.mp4" ]
      then
        echo "skipped : " $f " : already existing"
    else
      if [ "$test" == "" ];then
       ffmpeg -i $f -i /opt/scps/$name.png.waifu.crush $f.mp4
      else
	echo $name 'already uploaded'
      fi
    fi
done

for f in /media/scps/*.mkv
do

name=${f#/media/scps/}
name=${name%.txt.wav.mkv}
echo $name

descfile=${f%.wav.mkv}

desc= cat $descfile


  youtube-upload \
--client-secrets=client_secrets.json \
--title $name \
--description $desc \
--tags=tag,tag \
--playlist=scps \
$f
#4/RsbF1w72cKzW29STcRNXgcLrRr9YbSzHjhTbNZ4wsWE
done

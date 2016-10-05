for f in /opt/scp/*.mkv
do
name=${f#/opt/scp/}
name=${name%.txt.wav.mkv}
descfile=${f%.wav.mkv}
desc= cat $descfile
  youtube-upload \
    --client-secrets=client_secrets.json \
    --title $name \
    --description $desc \
    --tags=tag,tag \
    --playlist=scps \
    $f
done

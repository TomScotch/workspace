for f in /opt/scps/*.mkv
do
name=${f#/opt/scps/}
name=${name%.html.txt.wav.mkv}
descfile=${f%.wav.mkv}
desc=$(< $descfile)
desc=$(python remove.py $desc)
    youtube-upload \
    --client-secrets="/opt/youtube-uploader/client_secrets.json" \
    --title="$name" \
    --description="$desc" \
    --tags="$name" \
    "$f"
sleep 60
done

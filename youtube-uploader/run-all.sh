for f in /opt/scps/*.mkv
do
name=${f#/opt/scps/}
name=${name%.txt.wav.mkv}
descfile=${f%.wav.mkv}
desc=$(< $descfile)
echo $desc
#desc=$(python remove $desc)
#    youtube-upload \
#    --client-secrets="/opt/youtube-uploader/client_secrets.json" \
#    --title="$name" \
#    --playlist="scps" \
#    --description="$desc" \
#    --tags="$name" \
#    "$f"
done

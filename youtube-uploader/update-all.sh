for f in /opt/scp/*.mkv
do
name=${f#/opt/scp/}
name=${name%.txt.wav.mkv}
descfile=${f%.wav.mkv}
desc=$(< $descfile)
  python update_video.py \
    --client-secrets="client_secrets.json" \
    --title="$name" \
    --playlist="scps" \
    --description="$desc" \
    --tags="$name" \
  "$f"
done

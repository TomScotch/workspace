touch /opt/scps/.log
for f in /opt/scps/*.mp4
do
name=${f#/opt/scps/}
name=${name%.html.dump.txt.wav.mp4}
test=$(grep $name /opt/scps/.log)
descfile=${f%.wav.mp4}
desc=$(< $descfile)
if [ "$test" == "" ];then
desc=$(python remove.py $desc)
    youtube-upload \
    --client-secrets="/opt/youtube-uploader/client_secrets.json" \
    --title="$name" \
    --description="$desc" \
    --tags="scps, scp, foundation, containment, breach, reading, spoken, word, text, story, tale, fan, fiction, sci-fi, creepypasta, scp-wiki, scp-foundation, scp-reading" \
    "$f"
echo "$name" >> /opt/scps/.log
sleep 360
fi
done

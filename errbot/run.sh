docker run -d \
    --name err \
    -e BOT_USERNAME=err@xmmp.local \
    -e BOT_PASSWORD=error \
    -e BOT_ADMINS=admin@xmpp.local \
    -e CHATROOM_PRESENCE=err@conference.xmpp.local \
    -e "TZ=Europe/Berlin" \
    rroemhild/errbot

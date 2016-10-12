wget \
-U Mozilla \
--page-requisites \
--convert-links \
--recursive \
--no-clobber \
--domains $1
--user-agent="Googlebot/2.1 (+http://www.googlebot.com/bot.html)" \ 
$1

#execute commands
#exec.sh

docker exec ${PWD##*/} \
youtube-upload \
--client-secrets=client_secrets.json \
--title $2 \
--description $3 \
--tags=tag,tag \
--playlist=scps \
$1 4/RsbF1w72cKzW29STcRNXgcLrRr9YbSzHjhTbNZ4wsWE

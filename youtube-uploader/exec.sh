#execute commands
#exec.sh

docker exec ${PWD##*/} \
youtube-upload \
  --title=$2 \
  --client-secrets=client_secrets.json \
  $1 4/RsbF1w72cKzW29STcRNXgcLrRr9YbSzHjhTbNZ4wsWE

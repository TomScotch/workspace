#execute commands
#exec.sh

docker exec ${PWD##*/} \
youtube-upload \
  --title=$2 \
  --description=$3 \
  --category=$4 \
  --tags=$5 \
  --client-secrets=client_secrets.json
  $1

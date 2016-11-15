#execute commands
#exec.sh
docker exec ${PWD##*/} curl -i "https://api.dandelion.eu/datatxt/nex/v1/? text=$1 &include=types%2Cabstract%2Ccategories&token=fd969c4cddac4d1b9e05c8b7ada7efa5"

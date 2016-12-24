#execute commands
#exec.sh
docker exec ${PWD##*/} node examples/middleware.js && node examples/generate.js

#execute commands
#exec.sh
docker exec ${PWD##*/} python main.py /opt/input.jpg /opt/spec.jpg /opt/output.png

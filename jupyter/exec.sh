#execute commands
#exec.sh
docker exec ${PWD##*/} \
jupyter notebook --ip 0.0.0.0 --port 8887 & \
jupyterhub --ip 0.0.0.0 --port 443 & \
jupyter lab --ip 0.0.0.0 --port 8888

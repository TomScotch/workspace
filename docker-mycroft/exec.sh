./start.sh && nvidia-docker exec ${PWD##*/} supervisord -c /etc/supervisor/conf.d/supervisord.conf

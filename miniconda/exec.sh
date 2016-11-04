#execute commands
#exec.sh
docker exec ${PWD##*/} cd /opt/ && wget https://repo.continuum.io/miniconda/Miniconda-3.16.0-Linux-armv7l.sh && chmod +x /opt/Miniconda-3.16.0-Linux-armv7l.sh && ./opt/Miniconda-3.16.0-Linux-armv7l.sh

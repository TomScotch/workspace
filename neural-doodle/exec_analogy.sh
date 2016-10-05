#execute commands
#exec.sh
docker exec ${PWD##*/} \
python3 doodle.py --style samples/Monet.jpg --output samples/Coastline.png \
                  --device=cpu --iterations=10

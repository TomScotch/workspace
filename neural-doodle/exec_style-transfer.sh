#execute commands
#exec.sh
docker exec ${PWD##*/} \
python3 doodle.py --style samples/Gogh.jpg --content samples/Seth.png \
                  --output SethAsGogh.png --device=cpu --phases=4 --iterations=40

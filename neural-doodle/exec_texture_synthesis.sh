#execute commands
#exec.sh
docker exec ${PWD##*/} \
python3 doodle.py --style samples/Mia_sem.png --output Wall.png\
                  --seed=noise --seed-range=192:255 --iterations=50 --phases=3

nvidia-docker exec ${PWD##*/} \
  python convert.py && \
  python train.py && \
  python generate.py

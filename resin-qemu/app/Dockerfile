FROM ubuntu:16.04
RUN  apt update && apt install -y tmux git nano
RUN  apt install -y docker.io
CMD  tmux attach -t base || tmux new -s base


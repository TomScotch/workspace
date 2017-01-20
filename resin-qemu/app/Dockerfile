
FROM linuxbrew/linuxbrew
RUN sudo apt-get install -y tmux git nano wget
RUN brew tap yudai/gotty
RUN brew install gotty
EXPOSE 80
CMD gotty -p 80 -a 10.0.2.15 -w bash


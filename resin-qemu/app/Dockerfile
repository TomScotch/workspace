FROM linuxbrew/linuxbrew
RUN brew tap yudai/gotty
RUN brew install gotty
EXPOSE 80
CMD gotty -a 0.0.0.0 -p 80 -w bash

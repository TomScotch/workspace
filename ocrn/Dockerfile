FROM hypriot/rpi-python
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install python-numpy gcc python-sklearn -y
RUN pip install pybrain
RUN easy_install matplotlib
WORKDIR /opt
COPY . .
CMD python main.py

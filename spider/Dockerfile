FROM armhf/ubuntu:16.10
RUN apt-get update && apt-get dist-upgrade -y
RUN apt-get install -y python-mvpa2
COPY bin/ /opt/
WORKDIR /opt/
CMD cd learner && python run.py

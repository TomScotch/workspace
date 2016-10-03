FROM armhf/ubuntu
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get dist-upgrade -y
RUN apt-get upgrade -y
RUN apt-get install -y python3 python3-dev \
    python3-setuptools gcc gpp build-essential \
    wget bzip2 \
    ca-certificates sudo locales \
    npm nodejs nodejs-legacy wget locales git

RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8

ENV PATH=/opt/conda/bin:$PATH

RUN easy_install3 pip
RUN pip3 install jupyter notebook jupyterhub

RUN pip3 install jupyterlab
RUN jupyter serverextension enable --py jupyterlab --sys-prefix

RUN npm install -g configurable-http-proxy && rm -rf ~/.npm

RUN cd opt && git clone https://github.com/jupyter/jupyterhub.git

WORKDIR /opt/jupyterhub

RUN python3 setup.py js && pip install . && \

    rm -rf $PWD ~/.cache ~/.npm

EXPOSE 8888
EXPOSE 8887

LABEL org.jupyter.service="jupyterhub"
RUN jupyterhub --generate-config
RUN wget https://raw.githubusercontent.com/jupyter/docker-stacks/master/base-notebook/start-singleuser.sh
RUN chmod +x start-singleuser.sh
CMD ./start-singleuser.sh & jupyter lab --ip 0.0.0.0 --port 8887

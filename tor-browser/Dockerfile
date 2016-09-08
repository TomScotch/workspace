FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git nano wget make gpp gcc binutils build-essential
RUN git clone https://git.torproject.org/builders/tor-browser-bundle.git /opt/tor-browser
WORKDIR /opt/tor-browser
RUN apt-get install -y torsocks tor
RUN apt-get install -y ruby apache2 git apt-cacher-ng python-vm-builder qemu-kvm virt-what lxc lxctl fakeroot faketime zip unzip subversion
RUN git checkout tbb-6.0.4-build1 && cd gitian && make && make install


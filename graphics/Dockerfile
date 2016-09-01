FROM resin/rpi-raspbian
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get -y install gcc make bc screen ncurses-dev g++-4.7 libsdl1.2-dev git nano wget curl
WORKDIR /opt
RUN git clone --depth=1 https://github.com/raspberrypi/linux.git
RUN git clone https://github.com/simonjhall/challenge
RUN git clone https://github.com/simonjhall/dma
RUN git clone https://github.com/raspberrypi/quake3.git
WORKDIR linux
RUN git apply ~/challenge/kernel/patch.diff
RUN zcat /proc/config.gz > .config
RUN make oldconfig
RUN make menuconfig
RUN make ARCH=arm
RUN make ARCH=arm modules_install
RUN cp arch/arm/boot/Image /boot/kernel_simon.img
RUN echo kernel=kernel_simon.img >> /boot/config.txt
RUN echo gpu_mem=128 >> /boot/config.txt
RUN uname -a


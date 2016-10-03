FROM armhf/ubuntu
RUN apt-get update -y
RUN apt-get upgrade -y
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get install -y xpra rox-filer openssh-server pwgen xserver-xephyr xdm fluxbox xvfb sudo
RUN sed -i 's/DisplayManager.requestPort/!DisplayManager.requestPort/g' /etc/X11/xdm/xdm-config
RUN sed -i '/#any host/c\*' /etc/X11/xdm/Xaccess
RUN ln -s /usr/bin/Xorg /usr/bin/X
RUN echo X11Forwarding yes >> /etc/ssh/ssh_config
RUN sed -i 's/session    required     pam_loginuid.so/#session    required     pam_loginuid.so/g' /etc/pam.d/sshd
RUN dpkg-divert --local --rename --add /sbin/initctl && ln -sf /bin/true /sbin/initctl
RUN apt-get -y install fuse  || :
RUN rm -rf /var/lib/dpkg/info/fuse.postinst
RUN apt-get -y install fuse
RUN localedef -v -c -i en_US -f UTF-8 en_US.UTF-8 || :
ADD . /src
EXPOSE 22
CMD ["/bin/bash", "/src/startup.sh"]
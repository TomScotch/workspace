apt-get update
apt-get upgrade -y
apt-get dist-upgrade -y
apt-get install git nano sudo wget curl build-essential make gpp
cd /opt/ && git clone https://github.com/gigablast/open-source-search-engine.git osse
cd /opt/osse/
make
./gb -d
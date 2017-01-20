FROM kaixhin/cuda-torch
RUN luarocks install torch
RUN luarocks install nn
RUN luarocks install image
RUN luarocks install lua-cjson

RUN luarocks install cutorch
RUN luarocks install cunn
RUN luarocks install cudnn

RUN git clone https://github.com/zeruniverse/neural-colorization.git

WORKDIR neural-colorization

RUN apt-get install -y wget

RUN wget -O model.t7 "https://github.com/zeruniverse/neural-colorization/releases/download/1.0/places2.t7"

RUN mkdir -p /opt/frames/output/

WORKDIR /home

RUN wget http://ffmpeg.org/releases/ffmpeg-3.0.1.tar.bz2

RUN tar -xvf ffmpeg-3.0.1.tar.bz2

WORKDIR /home/ffmpeg-3.0.1

RUN ./configure && make && make install

WORKDIR neural-colorization

#th colorize.lua -model model.t7 -input_image input.jpg -output_image output.png -gpu 0
#th colorize.lua -model model.t7 -input_dir input -output_dir output -gpu 0

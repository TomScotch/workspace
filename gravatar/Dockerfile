FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y python wget
RUN wget https://gist.githubusercontent.com/TomScotch/eefae9a069f59b55a719e909393eced8/raw/5a8836bc3ed24509daa11ace16141ae273666e16/gravatar.py
CMD python gravatar.py tomscotch@web.de

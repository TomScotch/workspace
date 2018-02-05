nvidia-docker run --rm -t -v `pwd`:/d mecab/siggraph2016_colorization /d/$1 /d/out.png && mv out.png $1


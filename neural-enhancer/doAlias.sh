alias enhance='function ne() { nvidia-docker run --rm -v "$(pwd)/`dirname ${@:$#}`":/ne/input -it alexjc/neural-enhance:gpu ${@:1:$#-1} "input/`basename ${@:$#}`"; }; ne'

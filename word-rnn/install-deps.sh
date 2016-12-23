docker exec ${PWD##*/} $1 'docker luarocks install nngraph && luarocks install nninit && luarocks install optim && luarocks install nn && luarocks install underscore.lua --from=http://marcusirven.s3.amazonaws.com/rocks/'
# lrexlib-pcre PCRE_LIBDIR=/lib/x86_64-linux-gnu

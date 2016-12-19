for f in $(./scripts/find_unbuild.sh) ; do cd /home/tomscotch/workspace/$f ; ./build.sh; cd /home/tomscotch/workspace/ ; done

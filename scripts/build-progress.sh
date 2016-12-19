clear && x=$(/home/tomscotch/workspace/scripts/./find_unbuild.sh | wc -l) && y=$(ls -1 -d -- */ | wc -l) && echo $(($y - $x)) ; echo 'von : '$y

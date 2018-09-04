timestamp=$(date +%s);
rec -G --replay-gain track $timestamp.wav

##
timestamp=$(date +%s) ;
rec -G --replay-gain track $timestamp.wav & 
play -G --replay-gain track --norm $1 &&
killall rec ; 
sleep 7 ;
./convex.sh $timestamp.wav ; 
exit

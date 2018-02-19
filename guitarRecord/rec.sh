clear ;
timestamp=$(date +%s);
sox -c 1 -d $timestamp.wav ; # compand 0.3,1 -90,-90,-70,-70,-60,-20,0,0 -5 0 0.2 ;
#sox $timestamp.wav -n noiseprof noise-profile;
sox $timestamp.wav $timestamp-clean.wav noisered noise-profile 0.01 ;
sox $timestamp-clean.wav $timestamp.wav norm -20 ;
rm $timestamp-clean.wav ; clear ;
play $timestamp.wav ; clear

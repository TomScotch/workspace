clear ;
timestamp=$(date +%s);
sox -c 1 -d $timestamp.wav ;
sox $timestamp.wav -n noiseprof noise-profile;
sox $timestamp.wav $timestamp-clean.wav noisered noise-profile 0.2 ;
sox $timestamp-clean.wav $timestamp.wav norm -20 ;
rm noise-profile ; rm $timestamp-clean.wav ; clear ;
play $timestamp.wav ;

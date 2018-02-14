timestamp=$(date +%s);
arecord -f cd -c 1 $timestamp.wav;
sox $timestamp.wav -n noiseprof noise-profile;
sox $timestamp.wav $timestamp-clean.wav noisered speech.noise-profile 0.3 ;
sox $timestamp-clean.wav $timestamp.wav norm -0.5 ;
rm $timestamp-clean.wav

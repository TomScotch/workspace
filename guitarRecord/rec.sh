timestamp=$(date +%s);
arecord -f cd -c 1 $timestamp-unclean.wav;
sox $timestamp-unclean.wav $timestamp.wav -n trim 0 1.5 noiseprof speech.noise-profil;
sox $timestamp.wav norm noisered speech.noise-profile 0.5

#curl "http://localhost:59125/process?INPUT_TYPE=TEXT&INPUT_TEXT=$1&AUDIO=WAVE&LOCALE=en_US&OUTPUT_TYPE=AUDIO" > output.wav
curl "http://mary.dfki.de:59125/process?INPUT_TEXT=$1&INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&LOCALE=en_US&AUDIO=WAVE_FILE&VOICE=dfki-poppy" > $2

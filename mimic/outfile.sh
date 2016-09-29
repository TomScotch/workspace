for f in text/*.txt
do
        touch $f.wav && docker exec mimic bin/mimic -voice slt -o /opt/$f.wav -f /opt/$f
done

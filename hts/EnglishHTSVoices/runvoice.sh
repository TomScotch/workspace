#!/bin/sh

cd /opt/hts/ && build/bin/flite_hts_engine \
     -td build/hts_voice_cmu_us_arctic_slt-1.03/tree-dur.inf -tf build/hts_voice_cmu_us_arctic_slt-1.03/tree-lf0.inf -tm build/hts_voice_cmu_us_arctic_slt-1.03/tree-mgc.inf \
     -md build/hts_voice_cmu_us_arctic_slt-1.03/dur.pdf         -mf build/hts_voice_cmu_us_arctic_slt-1.03/lf0.pdf       -mm build/hts_voice_cmu_us_arctic_slt-1.03/mgc.pdf \
     -df build/hts_voice_cmu_us_arctic_slt-1.03/lf0.win1        -df build/hts_voice_cmu_us_arctic_slt-1.03/lf0.win2      -df build/hts_voice_cmu_us_arctic_slt-1.03/lf0.win3 \
     -dm build/hts_voice_cmu_us_arctic_slt-1.03/mgc.win1        -dm build/hts_voice_cmu_us_arctic_slt-1.03/mgc.win2      -dm build/hts_voice_cmu_us_arctic_slt-1.03/mgc.win3 \
     -cf build/hts_voice_cmu_us_arctic_slt-1.03/gv-lf0.pdf      -cm build/hts_voice_cmu_us_arctic_slt-1.03/gv-mgc.pdf    -ef build/hts_voice_cmu_us_arctic_slt-1.03/tree-gv-lf0.inf \
     -em build/hts_voice_cmu_us_arctic_slt-1.03/tree-gv-mgc.inf -k  build/hts_voice_cmu_us_arctic_slt-1.03/gv-switch.inf -o  $1.wav \
     $1

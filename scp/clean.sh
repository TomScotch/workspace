rm /media/scps/*.txt ; rm /media/scps/*.log ;
./setup.sh && ./process_scps.sh && ./dump_scps.sh && ./removetags.sh && ./process_text.sh && ./test_scps.sh

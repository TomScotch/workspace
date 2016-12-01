for f in /media/scps/*.txt ; do ./remove_text_from_file.sh '$f' '('; done
for f in /media/scps/*.txt ; do ./remove_text_from_file.sh '$f' ')'; done
for f in /media/scps/*.txt ; do ./remove_text_from_file.sh '$f' '['; done
for f in /media/scps/*.txt ; do ./remove_text_from_file.sh '$f' ']'; done
for f in /media/scps/*.txt ; do ./remove_text_from_file.sh '$f' '<'; done
for f in /media/scps/*.txt ; do ./remove_text_from_file.sh '$f' '>'; done
for f in /media/scps/*.txt ; do ./remove_text_from_file.sh '$f' '}'; done
for f in /media/scps/*.txt ; do ./remove_text_from_file.sh '$f' '{'; done

find /media/scps/*.txt -type f -print | xargs grep "$(cat tag_list.txt)"

docker start scp redis ;
docker exec scp python /data/get_scps.py & docker exec scp python /data/process_scps.py

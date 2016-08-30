docker run --name scp --link redis:db -itd -v /home/pi/workspace/scp:/data scotch/scp bash redis-cli -h $DB_PORT_6379_TCP_ADDR

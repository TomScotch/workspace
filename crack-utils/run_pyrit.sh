docker run -it --rm scotch/crack-utils \ 
			pyrit selftest && \ 
			pyrit check_db &&  \
			pyrit list_cores &&  \
			pyrit benchmark

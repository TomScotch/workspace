python train.py --data_dir=/opt/txt --num_steps 1000 --restore_from $(ls logdir/train/ -1 | sort | tail -n1)

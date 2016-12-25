python train.py --data_dir=/opt/txt --num_steps 999 --restore_from $(ls logdir/train/ -1 | sort | tail -n1)

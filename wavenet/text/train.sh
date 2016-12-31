python train.py --data_dir=/opt/text --num_steps 99999 --restore_from $(ls logdir/train/ -1 | sort | tail -n1)

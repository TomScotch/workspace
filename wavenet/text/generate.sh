python generate.py --text_out_path=mytext.txt --samples 4000 $(ls $(ls logdir/train/ -1 | sort | tail -n1) -1 | sort | tail -n1)

./movie2frames ffmpeg $1 frames png
python autocolorization.py
find ./frames -name "*.png" |sort > frames.txt
mkdir new_frames
[lua call]
avconv -f image2 -r 24 -i new_frames/%d.png -i audio.mp3 -r 24 -vcodec libx264 -crf 16 colorized_$1

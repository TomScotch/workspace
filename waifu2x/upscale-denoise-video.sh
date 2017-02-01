mkdir frames && \
avconv -i $1 -ss 00:09:00 -t 00:03:00 -r 24 -f image2 frames/%06d.png && \
avconv -i $1 -ss 00:09:00 -t 00:03:00 audio.mp3 && \
find ./frames -name "*.png" |sort > data/frame.txt && \
mkdir new_frames && \
th waifu2x.lua -m noise -noise_level 1 -resume 1 -l data/frame.txt -o new_frames/%d.png && \
avconv -f image2 -framerate 24 -i new_frames/%d.png -i audio.mp3 -r 24 -vcodec libx264 -crf 16 $1.enh.mp4 && \
./copy_out.sh $(find / -name $1.enh.mp4) && \
rm -r frames new_frames

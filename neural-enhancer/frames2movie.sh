#!/bin/bash
if [ $# -ne 4 ]; then
    echo "please provide the directory of the processed frames"
    echo "./frames2movie.sh [ffmpeg|avconv|mplayer] [frames_directory] [original_video_with_sound] [png|jpg]"
    exit 1
fi

if [ "png" == "$4" ]; then
    INFILES="$2/%08d.png"
    MENCODERCOMMAND="type=png"
else
    INFILES="$2/%08d.jpg"
    MENCODERCOMMAND="type=jpg"
fi

CODEC="h264"
OUTFILE="$(basename $2)_done.mp4"
TMPAUDIO="/tmp/tmp.aac"
TMPVIDEO="/tmp/tmp.mp4"

    FFMPEG=$(which ffmpeg)
    FFPROBE=$(which ffprobe)
    FPS=$(${FFPROBE} -show_streams -select_streams v -i "$3" 2>/dev/null | grep "r_frame_rate" | cut -d'=' -f2)

    "${FFMPEG}" -framerate ${FPS} -i "${INFILES}" -c:v ${CODEC} -vf "fps=${FPS},format=yuv420p" -profile:v baseline "${TMPVIDEO}" -y

    "${FFMPEG}" -i "$3" -strict -2 "${TMPAUDIO}" -y

    "${FFMPEG}" -i "${TMPAUDIO}" /tmp/music.wav

    "${FFMPEG}" -i "${TMPAUDIO}" -i "${TMPVIDEO}" -strict -2 -c:v copy -movflags faststart -shortest "${OUTFILE}"

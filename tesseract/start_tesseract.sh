docker run -it --name tesseract -v /home/pi/workspace/data/images/:/data scotch/tesseract tesseract /data/ocr.png /data/out -psm 10 && cat ../data/images/out.txt

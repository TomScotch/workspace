#execute commands
#exec.sh
docker exec ${PWD##*/} python3 main.py --base_img_path /opt/vincent/img/dali/input_base_face.jpg --style_img_path /opt/vincent/img/dali/input_style_dali.jpg  --result_prefix output.jpg

#execute commands
#exec.sh

docker exec ${PWD##*/} ruby scripts/$1.rb

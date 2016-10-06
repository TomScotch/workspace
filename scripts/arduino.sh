cmd=$1
num=$2
io=$3

if[$cmd==""] ; then
  echo "command unrecognized re-enter : ";
  read -s [cmd]
fi

if[isinstance( $num, int )]; then
  echo "please re-enter gpio pin number";
  read -s [num]
fi

if[isinstance($io, int )]; then
  echo "please re-enter gpio pin number";
  read -s [io]
fi

##
## ##############################
## 		CREATE
##

if [$cmd=="create"] ; then
  echo $io > /sys/class/gpio/export
  echo $io > /sys/class/gpio/gpio$num/direction
fi

##
## ##############################
## 		WRITE
##
if [$cmd=="write"] ;then
  echo $io > /sys/class/gpio/gpio$num/value
fi

##
## ##############################
## 		READ
##
if [$cmd=="read"] ;then
  cat /sys/class/gpio/gpio$num/value
fi

##
## ##############################
## 		REMOVE
##
if [$cmd=="remove"] ;then
  echo $num > /sys/class/gpio/unexport
fi


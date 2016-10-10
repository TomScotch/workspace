 import time
 import RPi.GPIO as GPIO 
 GPIO.setmode(GPIO.BOARD) 
 GPIO.setup(18, GPIO.IN) 
 GPIO.setup(11, GPIO.OUT) 
   while 1:   
     GPIO.output(11, GPIO.LOW)   
       if GPIO.input(18) == GPIO.HIGH:     
         GPIO.output(11, GPIO.HIGH)
         time.sleep(0.1)
         GPIO.output(11, GPIO.LOW)
         time.sleep(0.1) 

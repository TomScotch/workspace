import sys
from ghost import Ghost
ghost = Ghost(wait_timeout=4)
ghost.open(sys.argv[1])
ghost.capture_to(sys.argv[2])

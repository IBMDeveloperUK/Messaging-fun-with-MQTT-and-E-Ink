import sys
from inky import InkyPHAT
from envirophat import motion

try:
	motion.accelerometer()
	print("EnviroPHAT detected")
	sys.exit(200)
except IOError:
	print("No EnviroPHAT")
	sys.exit(100)

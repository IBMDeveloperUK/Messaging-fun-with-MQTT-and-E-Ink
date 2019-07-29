import envirophat, time, sys

envirophat.leds.on()

while True:

	colorLevels = envirophat.light.rgb();
	accel = envirophat.motion.accelerometer()

	data = {
		"color" : {
			"R" : colorLevels[0],
			"G" : colorLevels[1],
			"B" : colorLevels[2]
		},
		"lightLevel" : envirophat.light.light(),
		"temperature" : envirophat.weather.temperature(),
		"pressure" : envirophat.weather.pressure(),
		"accelerometer" : {
			"X" : accel[0],
			"Y" : accel[1],
			"Z" : accel[2]
		},
		"heading" : envirophat.motion.heading()
	}

	print(data)
	sys.stdout.flush()
	time.sleep(3)

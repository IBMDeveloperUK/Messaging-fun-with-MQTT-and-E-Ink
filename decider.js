const spawn = require('child_process').spawn;

const decider = spawn('python', [`${__dirname}/which-device.py`] );

decider.on('close', code => {
	console.log(code);

	if(code === 200){

		console.log(`Code 200. EnviroPHAT presumed connected`);

		const enviroMode = spawn('node', [`${__dirname}/enviro.js`]);

		enviroMode.stdout.on('data', (data) => {console.log('stdout:', data.toString('utf8')); });
		enviroMode.stderr.on('data', (data) => {console.log('stderr:', data.toString('utf8')); });
		enviroMode.on('close', (code) => { console.log(`EnviroPHAT program closed with code ${code}`) });

	} else if(code === 100){

		console.log(`Code 100. InkyPHAT presumed connected`);

		const inkyMode = spawn('node', [`${__dirname}/inky.js`]);

		inkyMode.stdout.on('data', (data) => { console.log('stdout:', data.toString('utf8')) });
		inkyMode.stderr.on('data', (data) => { console.log('stderr:', data.toString('utf8')) });
		inkyMode.on('close', (code) => { console.log(`InkyPHAT program closed with code ${code}`) });

	}

});

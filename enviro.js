const fs = require('fs');
const shortid = require('shortid');
const mqtt = require('mqtt');
const spawn = require('child_process').spawn;

let deviceID;

try{
	deviceID = fs.readFileSync(`${__dirname}/deviceID.txt`).toString('utf8');
} catch(err){
	console.log(`'deviceID' not found. Creating new one now`);
	deviceID = shortid.generate();
	fs.writeFileSync(`${__dirname}/deviceID.txt`, deviceID);
}

console.log('Assigned deviceID:', deviceID);

function handleMessage(topic, message){
	console.log('Received msg:', topic, message.toString());
	outputToEInkDisplay( message.toString() );
}

const mqttBrokerAddress = "mqtt://iot.eclipse.org";
const deviceMQTTTopic = `/ibm_developer_uk/${deviceID}`;

const mqttClient = mqtt.connect(mqttBrokerAddress);

mqttClient.on('connect', () => {
	console.log(`Connected to ${mqttBrokerAddress}`);
	console.log('Running', 'python', `${__dirname}/envirophat-output.py`);
	const enviro = spawn('python', [ `${__dirname}/envirophat-output.py` ]);

	enviro.stdout.on('data', (data) => {

		console.log( 'envirophat-output.py stdout:', data.toString('utf8') );

		const JSONData = data.toString('utf8').replace(/'/g, `"`);
		console.log('Parsed data:', JSONData);
		mqttClient.publish(deviceMQTTTopic, JSONData);
	});


	enviro.stderr.on('data', (data) => { console.log( 'envirophat-output.py stderr:', data.toString('utf8') ); } );

	enviro.on('close', (code) => {
		console.log(`EnviroPHAT interface closed with code ${code}`);
	});

});

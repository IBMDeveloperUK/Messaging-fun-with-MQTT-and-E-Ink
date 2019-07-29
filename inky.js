const fs = require('fs');
const shortid = require('shortid');
const mqtt = require('mqtt');
const spawn = require('child_process').spawn;

let deviceID;
let screenLocked = false;

try{
	deviceID = fs.readFileSync(`${__dirname}/deviceID.txt`).toString('utf8');
} catch(err){
	console.log(`'deviceID' not found. Creating new one now`);
	deviceID = shortid.generate();
	fs.writeFileSync(`${__dirname}/deviceID.txt`, deviceID);
}

console.log('Assigned deviceID:', deviceID);


function outputToEInkDisplay(text){

	if(screenLocked){
		console.log('Screen already rendering. Message will not be displayed');
		return;
	}

	screenLocked = true;
	console.log("Outputting text to display:", text);
	const output = spawn('python', [`${__dirname}/output-eink.py`, deviceID, text]);

	let timeout;

	output.on('close', (exitCode) => {
		console.log("output-eink.py exited with code:", exitCode);
		screenLocked = false;
		clearTimeout(timeout);
	});

	// Reset screenLocked if not unset after 30 seconds
	timeout = setTimeout(function(){

		console.log("Screen took too long to render. Resetting lock. Killing child process.");
		screenLocked = false;
		output.kill();

	}, 30000);

}

function handleMessage(topic, message){
	console.log('Received msg:', topic, message.toString());
	outputToEInkDisplay( message.toString() );
}

const mqttBrokerAddress = "mqtt://iot.eclipse.org";
const deviceMQTTTopic = `/ibm_developer_uk/${deviceID}`;
const teacherMQTTTopic = `/ibm_developer_uk/teacher`;
const mqttClient = mqtt.connect(mqttBrokerAddress);

mqttClient.on('connect', () => {
	console.log(`Connected to ${mqttBrokerAddress}`);
	mqttClient.subscribe(deviceMQTTTopic, (err) => {
		if(err){
			console.log(`Could not subscribe to device topic ${deviceMQTTTopic}`);
		} else {
			console.log(`Subscribed to device topic ${deviceMQTTTopic}`);
		}

	});

	mqttClient.subscribe(teacherMQTTTopic, (err) => {
                if(err){
                        console.log(`Could not subscribe to device topic ${deviceMQTTTopic}`);
                } else {
                        console.log(`Subscribed to device topic ${teacherMQTTTopic}`);
                }

        });

	mqttClient.on('message', handleMessage);
	outputToEInkDisplay('Ready!');

});

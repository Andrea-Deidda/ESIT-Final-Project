const awsIot = require('aws-iot-device-sdk');
require('dotenv/config')

const device = awsIot.device({
    host: process.env.AWS_HOST,
    port: 8883,
    keyPath: './private.pem.key',
    certPath: './certificate.pem.crt',
    caPath: './AmazonRootCA1.pem',
});

const topic = "$aws/things/esit-obj1/shadow/get"

function sendData(){
    const message = {
        state: {
            desired: {
                protocollo: "wifi"
            },
            reported: {
                protocollo: "wifi"
            }
        }
    };

    console.log('STEP - Sending data to AWS  IoT Core')
    console.log('---------------------------------------------------------------------------------')
    console.log(JSON.stringify(message))
    return device.publish(topic, JSON.stringify(message))
}


device
    .on('connect', function () {
        console.log('STEP - Connecting to AWS  IoT Core');
        console.log('---------------------------------------------------------------------------------')
        setInterval(() => sendData(), 3000)

    });


// Set handler for the device, it will get the messages from subscribers topics.
device
    .on('message', function (topic, payload) {
        console.log('message', topic, payload.toString());
    });

device
    .on('error', function (topic, payload) {
        console.log('Error:', topic, payload.toString());
    });

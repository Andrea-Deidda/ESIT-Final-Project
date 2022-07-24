const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
    host: 'a2sgc0kgj151w0-ats.iot.us-east-1.amazonaws.com',
    port: 8883,
    keyPath: './private.pem.key',
    certPath: './certificate.pem.crt',
    caPath: './AmazonRootCA1.pem',
});

const topic = "$aws/things/esit-obj1/shadow/get/accepted"

function sendData(){
    const message = {
        state: {
            desired: {
                protocollo: "ble"
            },
            reported: {
                protocollo: "ble"
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

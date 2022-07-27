const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const {response} = require('express');
require('dotenv').config();

const shadow_endpoint = process.env.AWS_HOST;
const OBJ_THING = 'esit-obj1';


const iotData = new AWS.IotData({endpoint: shadow_endpoint});

router.get('/', (req, res) => {
    console.log('get shadow');
    const params = {thingName: OBJ_THING};
    iotData.getThingShadow(params, function (err, data) {
        if (err) {
            return res.send(err);
        } else {
           return res.send(data.payload);
        }
    });
});

router.post('/update/:val', (req, res) =>{
    console.log('update shadow');
    var payload = {state: {desired: {protocollo: `${req.params.val}`}}};
    var params = {payload: JSON.stringify(payload), 
    thingName: OBJ_THING};
    iotData.updateThingShadow(params, function(err, data){
        if (err) {
            return res.send(err);
        } else {
            return res.send(data.payload);
        }
    });
});



module.exports = router;
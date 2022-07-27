const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3000;

const deviceRouter = require('./routes/devices');
const deviceRouterShadow = require('./routes/shadow');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/device', deviceRouter);
app.use('/shadow', deviceRouterShadow);

app.get('/',(req, res) => {
    res.send('<h1>Node.js CRUD API</h1> <h4>Message: Success</h4><p>Version: 1.0</p>');
})

app.get('/healt', (req, res) => {
    res.send();
})

app.listen(port, () => {
    console.log('Listening to port ' + port);
})
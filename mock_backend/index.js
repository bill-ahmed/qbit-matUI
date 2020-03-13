var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser')
var multer = require('multer');
var GetMainData = require('./sample_data').GetMainData;

var upload = multer();
var app = express();

const PORT = 4300;
const CREDS = require('./config.json');

app.use(cors());
app.use(cookieParser());

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

// For parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.post('/api/v2/auth/login', function (req, res, next) {
    var user = req.body.username;
    var pass = req.body.password;

    if(user === CREDS.login.username && pass === CREDS.login.password){
        res.cookie('SID', '8c212779b4abde7A');
        res.send("Ok.");
    } else {
        res.send("Fail.");
    }
    next();
});

app.get('/api/v2/sync/maindata', function(req, res) {
    let response = GetMainData();

    res.json(response);
});

app.listen(PORT, function () {
  console.log(`Server listening on: http://localhost:${PORT}\n`);
  console.log(`Username: ${CREDS.login.username}, Password: ${CREDS.login.password}`)
})
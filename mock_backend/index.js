var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser')
var multer = require('multer');
var GetMainData = require('./sample_data').GetMainData;
var GetUserPreferences = require('./sample_data').GetUserPreferences;
var GetAppVersion = require('./sample_data').GetAppVersion;
var GetAPIVersion = require('./sample_data').GetAPIVersion;
var GetRandomInt = require('./utils.js').GetRandomInt;

var upload = multer();
var app = express();

const PORT = process.env.PORT || 4300;
const CREDS = require('./config.json');

app.use(cors());
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// For parsing multipart/form-data
app.use(upload.array());
app.use('/', express.static(path.join(__dirname, 'public')));

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

app.get('/', function(req, res) {
  res.render('public/index');
});

app.get('/api/v2/sync/maindata', function(req, res) {
    let response = GetMainData();
    res.json(response);
});

app.post('/api/v2/torrents/files', function(req, res) {
  let response = [{
      name: "Ubuntu LTS 18.04/something.iso",
      /** File size (bytes) */
      size: GetRandomInt(0, 900000000000),
      progress: Math.random(),
      priority: 1,
      is_seed: true,
      piece_range: [],
      availability: Math.random(),
  }, {
    name: "Ubuntu LTS 20.20/another.iso",
    /** File size (bytes) */
    size: GetRandomInt(0, 900000000000),
    progress: Math.random(),
    priority: 6,
    is_seed: false,
    piece_range: [],
    availability: Math.random(),
  }];
  res.json(response);
});

app.get('/api/v2/app/preferences', function(req, res) {
    let response = GetUserPreferences();
    res.json(response);
});

app.get('/api/v2/app/version', function(req, res) {
  let response = GetAppVersion();
  res.send(response);
});

app.get('/api/v2/app/webapiVersion', function(req, res) {
  let response = GetAPIVersion();
  res.send(response);
});

/** KEEP THIS AT THE END!
 * All un-set routes will go through here.
 */
app.use(function(req, res){
  res.status(200).send();
});

app.listen(PORT, function () {
  console.log(`Server listening on: http://localhost:${PORT}\n`);
  console.log(`Username: ${CREDS.login.username}, Password: ${CREDS.login.password}`)
})

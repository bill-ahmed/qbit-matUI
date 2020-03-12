var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser')
var multer = require('multer');
var GetRandomInt = require('./utils.js').GetRandomInt;

var upload = multer();
var app = express();
var rid = 0;    // Used for /sync/maindata endpoint

const PORT = 4300;
const CREDS = require('./config.json');

// Maximum upload/download speeds for mock data
const MIN_SPEED = 0;
const MAX_SPEED = 90000000;

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
    let response = {
        "rid":0,
        "full_update": true,
        "torrents": [
            {"dlspeed":GetRandomInt(MIN_SPEED, MAX_SPEED),"eta":87,"f_l_piece_prio":false,"force_start":false,"hash":"8c212779b4abde7AAAA608063a0d008b7e40ce32","category":"","name":"debian-8.1.0-amd64-CD-1.iso","num_complete":-1,"num_incomplete":-1,"num_leechs":2,"num_seeds":86,"priority":1,"progress":0.187059783936,"ratio":0,"seq_dl":false,"size":657457152,"state":"downloading","super_seeding":false,"upspeed":GetRandomInt(MIN_SPEED, MAX_SPEED)},
            {"dlspeed":GetRandomInt(MIN_SPEED, MAX_SPEED),"eta":32,"f_l_piece_prio":false,"force_start":true,"hash":"8c212779b4abde7BBB608063a0d008b7e40ce32","category":"","name":"debian-CD-1.iso","num_complete":-1,"num_incomplete":-1,"num_leechs":22,"num_seeds":4,"priority":3,"progress":0.9783936,"ratio":0,"seq_dl":false,"size":657457152,"state":"downloading","super_seeding":false,"upspeed":0},
            {"dlspeed":GetRandomInt(MIN_SPEED, MAX_SPEED),"eta":12,"f_l_piece_prio":false,"force_start":false,"hash":"8c212779b4CCCCc6bc608063a0d008b7e40ce32","category":"","name":"8.1.0-amd64-CD-1.iso","num_complete":-1,"num_incomplete":-1,"num_leechs":222,"num_seeds":13,"priority":2,"progress":0.787059783936,"ratio":0,"seq_dl":false,"size":657457152,"state":"downloading","super_seeding":false,"upspeed":GetRandomInt(MIN_SPEED, MAX_SPEED)},
            {"dlspeed":GetRandomInt(MIN_SPEED, MAX_SPEED),"eta":89,"f_l_piece_prio":false,"force_start":false,"hash":"8c212779b4DDD7c6bc608063a0d008b7e40ce32","category":"","name":"debian-amd64-CD-1.iso","num_complete":-1,"num_incomplete":-1,"num_leechs":2222,"num_seeds":544,"priority":4,"progress":0.59783936,"ratio":0,"seq_dl":false,"size":657457152,"state":"downloading","super_seeding":false,"upspeed":GetRandomInt(MIN_SPEED, MAX_SPEED)}
        ],
        "torrents_removed": [],
        "categories": [],
        "categories_removed": [],
        "queueing": true,
        "server_state": {
            "dl_info_speed": GetRandomInt(MIN_SPEED, MAX_SPEED),
            "dl_info_data": GetRandomInt(MIN_SPEED, MAX_SPEED),
            "up_info_speed": GetRandomInt(MIN_SPEED, MAX_SPEED),
            "up_info_data": GetRandomInt(MIN_SPEED, MAX_SPEED),

        }
    };

    res.json(response);
    rid += 1;
    console.log("Sent torrent data.");
});

app.listen(PORT, function () {
  console.log(`Server listening on: http://localhost:${PORT}\n`);
  console.log(`Username: ${CREDS.login.username}, Password: ${CREDS.login.password}`)
})
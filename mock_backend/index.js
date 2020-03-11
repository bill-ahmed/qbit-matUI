var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser')
var app = express();

const PORT = 4300;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded());

app.post('/api/v2/auth/login', function (req, res, next) {
    console.log(req);
    res.cookie('SID', '8c212779b4abde7A');
    res.send("Ok.");
});

app.get('/api/v2/sync/maindata', function(req, res) {
    let response = {"rid":0,"torrents": [
        {"dlspeed":9681262,"eta":87,"f_l_piece_prio":false,"force_start":false,"hash":"8c212779b4abde7AAAA608063a0d008b7e40ce32","category":"","name":"debian-8.1.0-amd64-CD-1.iso","num_complete":-1,"num_incomplete":-1,"num_leechs":2,"num_seeds":86,"priority":1,"progress":0.187059783936,"ratio":0,"seq_dl":false,"size":657457152,"state":"downloading","super_seeding":false,"upspeed":0},
        {"dlspeed":1234567,"eta":32,"f_l_piece_prio":false,"force_start":true,"hash":"8c212779b4abde7BBB608063a0d008b7e40ce32","category":"","name":"debian-CD-1.iso","num_complete":-1,"num_incomplete":-1,"num_leechs":22,"num_seeds":4,"priority":3,"progress":0.9783936,"ratio":0,"seq_dl":false,"size":657457152,"state":"downloading","super_seeding":false,"upspeed":0},
        {"dlspeed":8885795,"eta":12,"f_l_piece_prio":false,"force_start":false,"hash":"8c212779b4CCCCc6bc608063a0d008b7e40ce32","category":"","name":"8.1.0-amd64-CD-1.iso","num_complete":-1,"num_incomplete":-1,"num_leechs":222,"num_seeds":13,"priority":2,"progress":0.787059783936,"ratio":0,"seq_dl":false,"size":657457152,"state":"downloading","super_seeding":false,"upspeed":0},
        {"dlspeed":134,"eta":89,"f_l_piece_prio":false,"force_start":false,"hash":"8c212779b4DDD7c6bc608063a0d008b7e40ce32","category":"","name":"debian-amd64-CD-1.iso","num_complete":-1,"num_incomplete":-1,"num_leechs":2222,"num_seeds":544,"priority":4,"progress":0.59783936,"ratio":0,"seq_dl":false,"size":657457152,"state":"downloading","super_seeding":false,"upspeed":0}
    ]};

    res.json(response);
});

app.listen(PORT, function () {
  console.log(`Server listening on: http://localhost:${PORT}`);
})
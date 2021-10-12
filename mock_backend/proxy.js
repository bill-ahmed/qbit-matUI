var express = require('express');
var proxy = require('express-http-proxy');
var cors = require('cors');

const PORT = process.env.PORT || 4300;
const PROXY = 'http://localhost:8080';
const log = (...args) => { console.log(`[${new Date().toLocaleString()}]`, ...args); }

var app = express();
app.use(cors());

// Proxy to qBittorrent running LOCALLY
// Must have access without authentication
// in order for it ot work.
app.use(proxy(PROXY, {
  // Only used for logging
  filter: function(req, res) {
    let path = req.originalUrl
    log(`${path} --> ${PROXY}`);
    return true;
  }
}));

app.listen(PORT, function () {
  log(`PROXY listening on: http://localhost:${PORT}\n`);
})

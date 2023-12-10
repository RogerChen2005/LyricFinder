const express = require('express');
const functions = require("./functions.js");
const download = require('./download.js');
const https = require('https');
const fs = require('fs');
const privateKey = fs.readFileSync('./cert/private.pem', 'utf8');
const certificate = fs.readFileSync('./cert/file.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

download.set_download_path();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('static'));

app.post('/func', async (req, res, next) => {
  let body = req.body;
  if (functions[body.target]) {
    res.end(await functions[body.target](res, body.data));
    console.log(`[${new Date().toTimeString()}] ${body.target}`);
  }
  else res.status(404).end();
  next();
})

app.post('/download', async (req, res, next) => {
  res.end(await download[req.body.target](req.body.data, res));
  console.log(`[${new Date().toTimeString()}] ${req.body.target}`);
  next();
})

app.post('/file', (req, res) => {
  download.get_file(req.body, res);
  return;
})

app.listen(3030, () => {
  console.log("Express server is running at http://127.0.0.1:3030");
});

// const httpsServer = https.createServer(credentials, app);
// httpsServer.listen(3030, () => {
//     console.log("Https server is running at https://127.0.0.1:3030");
// });
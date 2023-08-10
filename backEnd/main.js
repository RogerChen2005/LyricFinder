const ws = require('ws');
const express = require('express');
const functions = require("./functions.js");
const download = require('./download.js');

const wss = new ws.WebSocketServer({ port: 3000 }, () => {
  console.log("WebSocketServer running at http://127.0.0.1:3000");
});

wss.on('connection', (socket) => {
  socket.on('error', console.error);
  socket.on('message', (data) => { onMessage(socket, data) });
});

function send(target,message){
    wss.clients.forEach((socket)=>{
      socket.send(JSON.stringify({
        target:target,
        message:message
      }))
    })
  }

download.set_socket(send);

async function onMessage(socket, command) {
  let cmd = JSON.parse(command);
  let func;
  if (cmd.target) {
    func = functions[cmd.target];
  }
  socket.send(await func(cmd.data));
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('static'));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Credentials','true');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.post('/func',async (req,res,next)=>{
  let body = req.body;
  res.end(await functions[body.target](body.data));
  console.log(`[${new Date().toTimeString()}] ${body.target}`);
  next();
 })


app.listen(3030,()=>{
  console.log("Express server is running at http://127.0.0.1:3030");
}) ;
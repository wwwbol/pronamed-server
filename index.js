const cors = require('cors')
const path = require('path');
const express = require('express');
const app = express();
const wsServer = require('express-ws')(app); 
const config = require('./config');
const {LocalStorage} = require("node-localstorage");
const router = require('./routes/routes.js');

var localStorage = new LocalStorage('./scratch');
if(localStorage.getItem('numNota')==null){
  localStorage.setItem('numNota', parseInt(config.NUMNOTA))
}

let clients = new Array;

function clientResponse(data){ 
  console.log(data)
  broadcast(data); 
}
function handleWs(ws, request) {
  console.log("New Connection");        
  clients.push(ws);
  function endClient(){
    var position = clients.indexOf(ws);
    clients.splice(position, 1);
    console.log("connection closed");
  }    
  broadcast()

  ws.on('message', clientResponse);
  ws.on('close', endClient);
}
function broadcast(data) {
  let timeINV = parseInt(localStorage.getItem('timeINV'))
  for (let c in clients) { clients[c].send(timeINV); }
}

app.set('port', process.env.PORT || 80);

app.use(express.static(path.join(__dirname,'public')));
app.use(cors())
app.use(express.json()); 
app.use('/', router);
app.ws('/', handleWs);

const server = app.listen(app.get('port'),()=>{ 
  console.log("http://127.0.0.1 : "+ server.address().port) 
});


const config = require('../config.js');
const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./scratch');

async function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  let serv = localStorage.getItem('serv')
  if(!token) {
    localStorage.setItem('serv', "libre")
    return res.status(401).send({message:"No Token aws Provided"});
  }
  if(token!=config.TOKEN) {
    localStorage.setItem('serv', "libre")
    return res.status(401).send({message:"No Token aws Autorised"});
  }
  if(serv=="ocupado") {
    return res.status(401).send("ocupado");
  }
  
  if(serv=="libre" && token==config.TOKEN) {
    localStorage.setItem('serv', "ocupado")
    return  next();
  }else{
    return res.status(500).send("There was a problem");
  }
  
}
module.exports = { verifyToken: verifyToken}
const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./scratch');

async function servicio(req, res, next) {

  let serv = localStorage.getItem('serv')
  if(localStorage.getItem('serv')==null){
    localStorage.setItem('serv', "libre")
    serv = "libre"
  }
  if(serv == "libre") {
    return next();
  }else{
    return res.status(500).send("ocupado");
  }
}

module.exports = { servicio: servicio }
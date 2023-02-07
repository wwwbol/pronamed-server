const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./scratch');
const Datastore = require('nedb');
global.inventario = new Datastore({filename:'./data/inventario.dat', autoload: true});
var inventario = global.inventario

exports.c_inventario = async (req, resp) => {
  try {
    req.body["_id"] = req.body["id"]
    req.body["time"] = Date.now()
    inventario.find({"_id": req.body["_id"]}, function(err, record) {
      if(record.length==0){
        inventario.insert(req.body, function(err, record) {
          resp.status(200).send("created")
          localStorage.setItem('serv', "libre")
        })
      }else{
        resp.status(200).send("exist")
        localStorage.setItem('serv', "libre")
      }
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.u_data_inventario = async (req, resp) => {
  try {
    req.body["_id"] = req.body["id"]
    req.body["time"] = Date.now()
    inventario.find({"_id": req.body["_id"]}, function(err, record) {
      if(record.length==0){
        resp.status(200).send("empty")
        localStorage.setItem('serv', "libre")
      }else{
        inventario.update({ "_id":req.body["_id"]},{ $set:  req.body },{},function(){
          resp.status(200).send("updateInv")
          localStorage.setItem('serv', "libre")
        })
      }
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.del_inventario = async (req, resp) => {
  try {
    inventario.remove({_id: req.body["_id"]},{}, function(err, numRemoved) {
      if(numRemoved==1){
        resp.status(200).send("delet")
        localStorage.setItem('serv', "libre")
      }else{
        resp.send("deletFail")
        localStorage.setItem('serv', "libre")
      }
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.read_inventario = async (req, resp) => {
  try {
    let tim = req.body["time"]
    inventario.find({ time: { $gt: tim } }, function(err, record) {
      inventario.count({}, function (err, count) {
        resp.status(200).send({"record":record,"count":count})
        localStorage.setItem('serv', "libre")
      });
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};
exports.read_inventarioIDS = async (req, resp) => {
  try {
    inventario.find({}, function(err, record) {
      let ids = []
      for (let i = 0; i < record.length; i++) {
        const id = record[i]["id"];
        ids.push({id})
      }
      resp.status(200).send(ids)
      localStorage.setItem('serv', "libre")
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.u_cant_venta_inventario = async (req, resp) => {
  try {
    req.body["_id"] = req.body["id"]
    inventario.find({_id: req.body["_id"]}, function(err, record) {
      if(record.length==0){ 
        resp.status(200).send("empty")
        localStorage.setItem('serv', "libre")
      }else{
        let dif = record[0]["cantRes"] - req.body["cantRes"]
        inventario.update({ _id:req.body["_id"]}, {$set: {cantRes:dif,time:Date.now()}}, {}, function(err, num) {
          if (err) {console.error(err); }
          resp.status(200).send("update")
          localStorage.setItem('serv', "libre")
        });
      }
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.u_cant_compra_inventario = async (req, resp) => {
  try {
    req.body["_id"] = req.body["id"]
    req.body["time"] = Date.now()
    inventario.find({_id: req.body["_id"]}, function(err, record) {
      if(record.length==0){ 
        resp.status(200).send("empty")
        localStorage.setItem('serv', "libre")
      }else{
        let dif = record[0]["cantRes"] + req.body["cantRes"]
        inventario.update({ _id:req.body["_id"]}, {$set: {cantRes:dif,time:Date.now()}}, {}, function(err, num) {
          if (err) {console.error(err); }
          resp.status(200).send("update")
          localStorage.setItem('serv', "libre")
        });
      }
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

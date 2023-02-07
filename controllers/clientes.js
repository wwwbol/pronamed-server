const Datastore = require('nedb');
var clientes = new Datastore({filename:'./data/clientes.dat', autoload: true});
const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./scratch');

exports.cu_clientes = async (req, resp) => {
  try {
    req.body["_id"] = req.body["id"]
    req.body["time"] = Date.now()
    clientes.find({_id: req.body["_id"]}, function(err, record) {
      if(record.length==0){
        clientes.insert(req.body, function(err, record) {
          resp.status(200).send("created")
          localStorage.setItem('serv', "libre")
        })
      }else{
        clientes.update({ _id:req.body["_id"]},req.body,{},function(){
          resp.status(200).send("newCreated")
          localStorage.setItem('serv', "libre")
        })
      }
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.del_clientes = async (req, resp) => {
  try {
    clientes.remove({_id: req.body["_id"]},{}, function(err, numRemoved) {
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
  
exports.read_clientes = async (req, resp) => {
  try {
    let tim = req.body["time"]
    clientes.find({ time: { $gt: tim } }, function(err, record) {
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
exports.read_clientesIDS = async (req, resp) => {
  try {
    clientes.find({}, function(err, record) {
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

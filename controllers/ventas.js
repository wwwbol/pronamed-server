const Datastore = require('nedb');
const {LocalStorage} = require("node-localstorage");
var localStorage = new LocalStorage('./scratch');

var ventas = new Datastore({filename:'./data/ventas.dat', autoload: true});
var inventario = global.inventario
exports.c_venta = async (req, resp) => {
  try {
    req.body["_id"] = req.body["id"]
    req.body["time"] = Date.now()
    ventas.find({_id: req.body["_id"]}, function(err, record) {
      if(record.length==0){
        let numNot = parseInt(localStorage.getItem('numNota'))+1
        req.body["numNota"] = numNot
        localStorage.setItem('numNota', numNot)
        ventas.insert(req.body, function(err, record) {
          let proforma = req.body["proforma"]
          for (const key in proforma) {
            const itemID = proforma[key]["id"];
            const itemCant = proforma[key]["cant"];
            inventario.find({_id: itemID}, function(err, record) {
              if(record.length!=0){
                let dif = record[0]["cantRes"] - itemCant
                let timeINV = Date.now()
                localStorage.setItem('timeINV',timeINV)
                inventario.update({ _id:itemID}, {$set: {cantRes:dif,time:timeINV}}, {}, function(err, num) {
                  if (err) {console.error(err); }
                });
              }
            });
          }
          resp.send("created")
          localStorage.setItem('serv', "libre")
        })
      }else{
        resp.send("exist")
        localStorage.setItem('serv', "libre")
      }
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.read_venta_id = async (req, resp) => {
  try {
    ventas.find({_id: req.body["_id"]}, function(err, record) {
      resp.send({"record":record[0]})
      localStorage.setItem('serv', "libre")
    });
  }catch(e){
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.u_venta = async (req, resp) => {
  try {
    req.body["_id"] = req.body["id"]
    req.body["time"] = Date.now()
    ventas.find({_id: req.body["_id"]}, function(err, record) {
      if(record.length==0){
        resp.send("empty")
        localStorage.setItem('serv', "libre")
      }else{
        ventas.update({ _id:req.body["_id"]},req.body,{},function(){
          //////EDITANDO VENTA ITEMS//////
          var InvAjus = []
          const carroAnt = record[0]["proforma"]
          const carroNue = req.body["proforma"]
          //for borrados o modificados//
          for (const key in carroAnt){
            const itemNue = carroNue[key];
            const itemAnt = carroAnt[key];
            if(itemNue == undefined){//borrados del carro
              InvAjus.push({id:key,cant:-itemAnt["cant"]}) 
              
            }else{//modifico del carro
              InvAjus.push({id:key,cant: (itemNue["cant"]-itemAnt["cant"])})
            }  
          }
          //for nuevos//
          for (const key in carroNue) {
            if(carroAnt[key] == undefined){
              InvAjus.push({id:key,cant:carroNue[key]["cant"]})
            }
          }
          /////EDITANDO VENTA ITEMS////// 
          ////// acualizando ajuste //////
          for (let i = 0; i < InvAjus.length; i++) {
            let itm = InvAjus[i].id
            let canti = InvAjus[i].cant
            inventario.find({_id: itm}, function(err, record) {
              if(record.length!=0){
                let dif = record[0]["cantRes"] - canti
                let timeINV = Date.now()
                localStorage.setItem('timeINV',timeINV)
                console.log(timeINV)
                inventario.update({ _id:itm}, {$set: {cantRes:dif,time:timeINV}}, {}, function(err, num) {
                  if (err) {console.error(err); }
                });
              }
            });
          }
          ////// acualizando ajuste //////
          resp.send("update")
          localStorage.setItem('serv', "libre")
        })
      }
    });
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.del_venta = async (req, resp) => {
  try {
    ventas.find({"_id": req.body["_id"]}, function(err, vent) {
      if(vent.length==0){
        resp.send("empty")
        localStorage.setItem('serv', "libre")
      }else{
        let proforma = vent[0]["proforma"]
        ventas.remove({_id: req.body["_id"]},{}, function(err, numRemoved) {
          if(numRemoved==1){
            for (const key in proforma) {
              const itemID = proforma[key]["id"];
              const itemCant = proforma[key]["cant"];
              inventario.find({_id: itemID}, function(err, record) {
                if(record.length!=0){
                  let dif = record[0]["cantRes"] + itemCant
                  let timeINV = Date.now()
                  localStorage.setItem('timeINV',timeINV)
                  inventario.update({ _id:itemID}, {$set: {cantRes:dif,time:timeINV}}, {}, function(err, num) {
                    if (err) {console.error(err); }
                  });
                }
              });
            }
            resp.send("delet")
            localStorage.setItem('serv', "libre")
          }else{
            resp.send("deletFail")
            localStorage.setItem('serv', "libre")
          }
        });
      }
    });
  }catch(e){  
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.del_ventaMarc = async (req, resp) => {
  try {
    ventas.find({"_id": req.body["id"]}, function(err, vent) {
      if(vent.length==0){
        resp.send("empty")
        localStorage.setItem('serv', "libre")
      }else{
        ventas.remove({_id: req.body["id"]},{}, function(err, numRemoved) {
          if(numRemoved==1){
            resp.send("delet")
            localStorage.setItem('serv', "libre")
          }else{
            resp.send("deletFail")
            localStorage.setItem('serv', "libre")
          }
        });
      }
    });
  }catch(e){  
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.read_ventas = async (req, resp) => {
  try {
    let tim = req.body["time"]
    ventas.find({ time: { $gt: tim } }, function(err, record) {
      ventas.count({}, function (err, count) {
        resp.status(200).send({"record":record,"count":count})
        localStorage.setItem('serv', "libre")
      });
    });
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.read_ventas_user = async (req, resp) => {///mayores al time
  try {
    let tim = req.body["time"]
    let user = req.body["user"]
    ventas.find({ $and: [{ time: { $gt: tim }}, { vendedor: user }]  }, function(err, record) {
      resp.status(200).send({"record":record})
      localStorage.setItem('serv', "libre")
    });
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.read_ventas_user_time = async (req, resp) => {//en el dia del time
  try {
    let user = req.body["user"]
    let tim1 = req.body["tim1"]
    let tim2 = req.body["tim2"]
    ventas.find({$and:[ {time:{$gt:tim1}}, {time:{$lt:tim2}}, {"dataVenden.nom":user} ]}, function(err, record) {
      resp.status(200).send({"record":record})
      localStorage.setItem('serv', "libre")
    });
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.read_ventasIDS = async (req, resp) => {
  try {
    ventas.find({}, function(err, record) {
      let ids = []
      for (let i = 0; i < record.length; i++) {
        const id = record[i]["id"];
        ids.push({id})
      }
      resp.status(200).send(ids)
      localStorage.setItem('serv', "libre")
    });
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};
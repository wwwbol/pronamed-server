const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./scratch');

exports.read_numNota = async (req, resp) => {
  try {
    let numNota = localStorage.getItem('numNota')
    resp.status(200).send(numNota)
    localStorage.setItem('serv', "libre")
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.write_numNota = async (req, resp) => {
  try {
    let numNota = req.body["numNota"]
    localStorage.setItem('numNota', parseInt(numNota))
    resp.send("write")
    localStorage.setItem('serv', "libre")
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

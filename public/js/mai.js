/*modal succes spiner*/
function loadData(){
  document.getElementById("block").style.display = "flex"
  document.getElementById("spinner").style.display = "block"
} 
function successDat(){
  
  document.getElementById("spinner").style.display = "none"
  document.getElementById("cajaSuccess").style.display= 'block';
  document.getElementById("checkSucc").classList.add('success');
  setTimeout(noSucsesDat,1000); 
}
function noSucsesDat(){
  document.getElementById("cajaSuccess").classList.add('desapareser');
  document.getElementById("block").style.display = "none"
  setTimeout(restarSucessesDat,750); 
}
function restarSucessesDat(){
 
  document.getElementById("cajaSuccess").style.display= 'none';
  document.getElementById("cajaSuccess").classList.remove('desapareser');
  document.getElementById("checkSucc").classList.remove('success');
}
/*modal succes spiner*/ 
/* manejador de formulario */
function formValues(id){
  return new Promise(function(resolve,reject){
      const f = document.querySelectorAll('[data-'+id+']')
      var form = {}
      for (let i = 0; i < f.length; i++) {
          const e = f[i]
          let id = e.id
          let val = e.value
          form[id]=val
          
      }
      resolve(form)
  })
}
function formClear(id){
  return new Promise(function(resolve,reject){
      const f = document.querySelectorAll('[data-'+id+']')
      for (let i = 0; i < f.length; i++) {
          const e = f[i]
          let id = e.id
          document.getElementById(id).value="";
      }
      resolve(true)
  })
}
function formWrite_modeForm(idf,data){
  return new Promise(function(resolve,reject){
      const f = document.querySelectorAll('[data-'+idf+']')
      for (let i = 0; i < f.length; i++) {
          const e = f[i]
          let id = e.id
          document.getElementById(id).value = data[id];;
      }
      resolve(true)
  })
}
/* manejador de formulario */

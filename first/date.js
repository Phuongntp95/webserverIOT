

var d = new Date();
var days ={
  day :"",
  month:"",
  year:""
}
days.day = d.getDate();
days.month = d.getMonth();
days.year = d.getYear();
console.log(d);
console.log(d.getDate()+"/"+ d.getMonth() +"/"+d.getYear()+":::"+d.getTime());

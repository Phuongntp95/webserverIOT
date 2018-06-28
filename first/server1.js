const express = require("express");
const app = express();
const server = require("http").createServer(app);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
//kết nối database
var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient;
var db = require('./db');
var io = require("socket.io")(server);
server.listen(3000);
var esp8266_nsp = io.of('/esp8266')	 // namespace cho esp8266
var webapp_nsp = io.of('/webapp')

//giải nén chuỗi JSON thành các OBJECT
function ParseJson(jsondata) {
    try {
        return JSON.parse(jsondata);
    } catch (error) {
        return null;
    }
}
var storage = require('node-persist'); // tạo luu trữ
storage.initSync();
storage.initSync({
    dir : 'internetofthings',
    ttl : false
});
var inf_sensor = {
  _id : "",
  date : "",
  humidity :"",
  temperature :""
};
// lấy toàn bộ thông tin
function getAllInf_sensors(){
  var inf_sensors = storage.getItemSync('dht11');
  if(typeof inf_sensors === "undefined"){
    return [];
  }
  return inf_sensors;
}
//tìm thông tin
function getInf_sensor(inf_sensorId){
  var inf_sensors = getAllInf_sensors();
  var sensor = null;
  for(var i=0;i<inf_sensors.length;i++){
    if(inf_sensors[i].id === inf_sensorId){
      sensor = inf_sensors[i];
      break;
    }
  }
  return sensor;
}
//thêm thông tin
function addInf_sensor(_id, date, humidity, temperature){
  var inf_sensors = getAllInf_sensors();
  inf_sensors.push({
    _id : _id,
    date : date,
    humidity : humidity,
    temperature : temperature
  });
  storage.setItemSync('dht11', inf_sensors);
}
function showInf_sensors(){
  var inf_sensor = getAllInf_sensors();
  inf_sensor.forEach(function(inf_sensor){
    console.log('độ ẩm: ' + inf_sensor.humidity +' nhiệt độ: '+ inf_sensor.temperature);
  });
}
var account = {
  _id : "",
  userid: "",
  password: ""
};
function getAllAccounts(){
  var accounts = storage.getItemSync('accounts');
  if(typeof accounts === "undefined"){
    return [];
  }
  return accounts;
}
function getAccount(accountId){
  var accounts = getAllAccounts();
  var account = null;
  for(var i=0;i<accounts.length;i++){
    if(accounts[i].id === accountId){
      account = accounts[i];
      break;
    }
  }
  return account;
}

function addAccount(_id, userid, password){
  var accounts = getAllAccounts();
  accounts.push({
    _id: _id,
    userid: userid,
    password: password
  });
  storage.setItemSync('accounts', accounts);
}
function showAccounts(){
  var accounts = getAllAccounts();
  accounts.forEach(function(account){
    console.log('account: ' + account.userid +' pass: '+ account.password);
  });
}
mongoClient.connect(db.url, function(err,data)
{
  if (err)
   console.log('không thể kết nối đến mongodb', err);
  else
  {
    console.log('kết nối thành công đến', db.url);
    var database = data.db('internetofthings');
    var collectAccount = database.collection('account');
    collectAccount.find({}).toArray(function(err,dataUser)
    {
      if(err)
        console.log('kết nối database lỗi:', err);
      else
      {
      dataUser.forEach(function(row){
        addAccount(row._id, row.userid, row.password);
      })
      }
    })
    var collectInf_sensor = database.collection('dht11');
    collectInf_sensor.find({}).toArray(function(err,dataSensor)
    {
      if(err)
        console.log('kết nối database lỗi:', err);
        else{
          dataSensor.forEach(function(row){
            addInf_sensor(row._id, row.date, row.humidity, row.temperature);
          })
        }
      })
    }
});
var acc = getAllAccounts();
var sensors = getAllInf_sensors();

//Bắt các sự kiện khi esp8266 kết nối
// esp8266_nsp.on('connection', function(socket)
// {
// 	console.log('esp8266 connected')
// 	socket.on('disconnect', function() {
// 		console.log("Disconnect socket esp8266")
// 	})
//   	//nhận được bất cứ lệnh nào
//   socket.on("*", function(packet)
//   {
// 		console.log("esp8266 rev and send to webapp packet: ", packet.data) //in ra để debug
// 		var eventName = packet.data[0]
// 		var eventJson = packet.data[1] || {} //nếu gửi thêm json thì lấy json từ lệnh gửi, không thì gửi chuỗi json rỗng, {}
// 		webapp_nsp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json lên server
// 	})
// })

  // bắt sự kiện khi webapp kết nối
webapp_nsp.on("connection", function(socket)
{
  console.log("Co nguoi ket noi " + socket.id);
  socket.on("client-send-dangnhap", function(data)
  {
    for(var i=0; i< acc.length; i++)
    {
      account = acc[i];
      if(account.userid == data.userid && account.password == data.password)
        socket.emit("server-send-dangnhap-success", data);
      else if(i == acc.length-1){
          socket.emit("server-send-dangnhap-fail");
      }
    }
  });

  socket.on("client-resquest-thoat",function(){
    storage.clearSync();  // xóa tất cả dl
  });

  // xử lý yêu cầu cập nhật thông tin
  socket.on("client-request-updateSensor",function(data){
    // gửi yêu cầu cho esp8268
    //on thông tin tử esp8268
    //emit webapp data vừa nhận được
    //test database
    inf_sensor = sensors.pop();
    socket.emit("server-send-updateSensor", inf_sensor)
    sensors.push(inf_sensor);
  });

//xử lí thống kê
  socket.on("client-request-thongKe",function()
  {
    var nhietDo=0;
    var doAm=0;
    var d ;
    sensors.forEach(function(sensor){
      doAm +=   parseInt(sensor.humidity);
      nhietDo += parseInt(sensor.temperature);
    });
    inf_sensor.humidity = doAm/sensors.length;
    inf_sensor.temperature =  nhietDo/sensors.length;
    d = sensors[0].date;
    socket.emit("server-send-thongKe",{inf_sensor,d})
  })
  // socket.on("disconnect", function() {
  //   console.log("ngắt kết nối  " + socket.id)
  // });

});


app.get("/",function(req, res){
  res.render("trangchu1");
});

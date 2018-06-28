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
var storage = require('node-persist'); // tạo luu trữ
storage.initSync();
storage.initSync({
    dir : 'accounts',
    ttl : false
});
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

function getaccount(accountId){
  var accounts = getAllAccounts();
  var matchedAccount = null;
  for(var i=0;i<accounts.length;i++){
    if(accounts[i].id === accountId){
      matchedAccount = accounts[i];
      break;
    }
  }
  return matchedAccount;
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
mongoClient.connect(db.url, function(err,data) {
  if (err) {
   console.log('không thể kết nối đến mongodb', err);
 } else {
   console.log('kết nối thành công đến', db.url);
   var database = data.db('internetofthings');
  var collectAccount = database.collection('account');
  collectAccount.find({}).toArray(function(err,dataIoT){
     if(err)
       console.log('kết nối database lỗi:', err);
    else {
      dataIoT.forEach(function(row){
        addAccount(row._id, row.userid, row.password);
      })
    }
  })
  }

});
var acc = getAllAccounts();

io.on("connection", function(socket){
  console.log("Co nguoi ket noi " + socket.id);

  // xử lí yêu cầu đăng nhập
  socket.on("client-send-dangnhap", function(data){
    for(var i=0; i< acc.length; i++)
    {
      account = acc[i];
      if(account.userid == data.userid && account.password == data.password)
      socket.emit("server-send-dangnhap-success", data);
      else if(i == acc.length-1){
          socket.emit("server-send-dangnhap-fail");

      }

    }
  // acc.forEach(function(account){
  //   if(account.userid == data.userid && account.password == data.password)
  //   socket.emit("server-send-dangnhap-success", data);
  // })

  // đăng nhập tbai
    //  socket.emit("server-send-dangnhap-fail");
  });
  //xử lí yêu cầu thoát
  socket.on("client-resquest-thoat", function(){

  });
    // xử lý yêu cầu cập nhật thông tin
  socket.on("client-request-thongtin",function(){
    // gửi yêu cầu cho esp8266
    ////////////////////////////////
    socket.emit("server-send-update-thongtin",data);// data dữ ;iệu nhận đc từ esp8266
  });

  // socket.on("disconnect", function() {
  //   console.log("ngắt kết nối  " + socket.id)
  // });

});

app.get("/",function(req, res){
  res.render("trangchu1");
});

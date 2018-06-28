bên gửi
emit("server-send",{un:soket.username, nd:data})
                    file json cần gửi, truyền json
                    un: tên-key
                    nd: gia tri-value
nhận
socket.on("server-send", function(data){
$(#khungnhin).append("<div class="ms">" + data.un + data.nd)
// gọi json nhận được ra
}
$("#txt").val();// lấy giá trị của id txt
thêm socket vào 1 room
socket.join(data);


    console.log(data.userid + data.password);
    socket.emit("client-send-dangnhap",{userid:$("#userid").val(), password:$("#password").val())}
duyệt mảng
kq.forEach(function(i){
  console.log(i.userid);

kết nối mongoDB
//
db.collection(collectionName).find(query).[anyThing].toArray(callback);
var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient;
var db = require('./db');
mongoClient.connect(db.url, function(err,data) {
  if (err) {
   console.log('Unable to connect to the mongoDB server. Error:', err);
 } else {
   console.log('Connection established to', db.url);
   var database = data.db('internetofthings');
  var account = database.collection('account');

  account.find({}).toArray(function(err,data){
     if(err)
       console.log('Unable to connect to the mongoDB server. Error:', err);
    else {
         console.log(data);
       }
  })
 }
});
// chỉ tìm du liệu user
user.find().exec(function(err, users){
  console.log(user);
})
// update du liêu
user.update(userid:"xx",{userid:"yy"}).exec(function(err,resul){
  console.log(resul);
})
// xóa dữ liệu
user.remove(userid:"xx").exec(function(err,resul){
  console.log(resul);
})

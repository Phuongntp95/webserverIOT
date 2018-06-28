var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
const PORT = 3000;
server.listen(PORT);
var ip = require('ip');
console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + PORT)

//var webapp_nsp = io.of('/webapp')
//var esp8266_nsp = io.of('/esp8266')

//var middleware = require('socketio-wildcard')();
//esp8266_nsp.use(middleware);
//webapp_nsp.use(middleware);
// server lắng nghe sự kiện có ng kết nối
io.on("connection", function(socket){
  console.log("có người kết nối "+ socket.id);
  socket.on("disconnect", function() {
    console.log("ngắt kết nối  " + socket.id)
});
  socket.on("Client-send-data", function(data){
    console.log(data);
  })
});

app.set("views","./views") ;   // layout nằm trong thư mục view
app.get("/",function(req, res){
  res.render("trangchu");
})

//Cài đặt webapp các fie dữ liệu tĩnh
// app.use(express.static("node_modules/mobile-angular-ui")) 			// Có thể truy cập các file trong node_modules/mobile-angular-ui từ xa
// app.use(express.static("node_modules/angular")) 							// Có thể truy cập các file trong node_modules/angular từ xa
// app.use(express.static("node_modules/angular-route")) 				// Có thể truy cập các file trong node_modules/angular-route từ xa
// app.use(express.static("node_modules/socket.io-client")) 				// Có thể truy cập các file trong node_modules/socket.io-client từ xa
// app.use(express.static("node_modules/angular-socket-io"))			// Có thể truy cập các file trong node_modules/angular-socket-io từ xa
// app.use(express.static("webapp")) 													// Dùng để lưu trữ webapp


//giải nén chuỗi JSON thành các OBJECT
// function ParseJson(jsondata) {
//     try {
//         return JSON.parse(jsondata);
//     } catch (error) {
//         return null;
//     }
// }
//
//
// //Bắt các sự kiện khi esp8266 kết nối
// esp8266_nsp.on('connection', function(socket) {
// 	console.log('esp8266 connected')
//
// 	socket.on('disconnect', function() {
// 		console.log("Disconnect socket esp8266")
// 	})
//
// 	//nhận được bất cứ lệnh nào
// 	socket.on("*", function(packet) {
// 		console.log("esp8266 rev and send to webapp packet: ", packet.data) //in ra để debug
// 		var eventName = packet.data[0]
// 		var eventJson = packet.data[1] || {} //nếu gửi thêm json thì lấy json từ lệnh gửi, không thì gửi chuỗi json rỗng, {}
// 		webapp_nsp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến webapp
// 	})
// })
//
// //Bắt các sự kiện khi webapp kết nối
//
// webapp_nsp.on('connection', function(socket) {
//
// 	console.log('webapp connected')
//
// 	//Khi webapp socket bị mất kết nối
// 	socket.on('disconnect', function() {
// 		console.log("Disconnect socket webapp")
// 	})
//
// 	socket.on('*', function(packet) {
// 		console.log("webapp rev and send to esp8266 packet: ", packet.data) //in ra để debug
// 		var eventName = packet.data[0]
// 		var eventJson = packet.data[1] || {} //nếu gửi thêm json thì lấy json từ lệnh gửi, không thì gửi chuỗi json rỗng, {}
// 		esp8266_nsp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến esp8266
// 	});
// })

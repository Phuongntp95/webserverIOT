var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

io.on("connection", function(socket){
  console.log("có người kết nối "+ socket.id);
  socket.on("disconnect", function() {
    console.log("ngắt kết nối  " + socket.id)
});
socket.on("Client-send-data", function(data){
  console.log(data);
  io.sockets.emit("server-send-data"+ data +"yyy")//phát toàn server
  //socket.emit("server-send-data"+ data+"xxx")  //con nao gửi y/c con đó nhận đc reply
  //socket.broadcast.emit("server-send-data"+ data+"xxx") // broadcast cho all trừ con y/c
});
});


app.get("/",function(req, res){
  res.render("vidu");
})

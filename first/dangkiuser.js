$('#btnDangKi').click(function(){

  socket.emit("client-send-dangki",
  {
    userid : $("#userid"),
    password:$("#password")
  });
});
//xử lí yêu cầu đăng kí
socket.on("client-send-dangki", function(data){
  //console.log(data.userid + " "+data.password);

  if(ArraysUser.indexOf.user(data.userid)>=0){ // tìm thấy dk thất bại
    socket.emit("server-send-dangki-fail");
  }
  else{
      ArraysUser.push(
         new quanLyTaiKhoan(data.user, data.password)
       );
      //socket.Username = data // username biến đc tạo trong socket
      socket.emit("server-send-dangki-success", ArraysUser);
 }
});

// nhận trả lời của server về việc đăng kí
socket.on("server-send-dangki-fail", function(){
  alert("đăng kí thất bại");
});
socket.on("server-send-dangki-success", function(data){
  $('#currentUser').html(data);
  $('#loginForm').hide(2000);
  $('#viewForm').show(1000);
});

var socket = io("http://localhost:3000");

//// nhận trả lời của server về việc đăng nhập
socket.on("server-send-dangnhap-fail", function(){
  alert("đăng nhập thất bại");
});
socket.on("server-send-dangnhap-success", function(data){
  $('#currentUser').html(data.userid);
  $('#loginForm').hide(2000);
  $('#viewForm').show(1000);
});
//nhận thông tin cập nhật từ Server
socket.on("server-send-update-thongtin", function(data){
  // truyền thông số vào #content
})


$(Document).ready(function(){
  $('h1').css('color','#e01111');
  $('h2').css('color','#e01111');
  $('#loginForm').show();
  $('#viewForm').hide();



  $('#btnDangNhap').click(function(data){
    socket.emit("client-send-dangnhap",
    {
      userid : $("#userid").val(),
      password :$("#password").val()
    });
  });

  $('#btnLogOut').click(function(){
    socket.emit("client-resquest-thoat")
    $('#loginForm').show(1000);
    $('#viewForm').hide(2000);
  });

  ('#btnUpdate').click(function(){
    socket.emit("client-request-thongtin")
  });
});

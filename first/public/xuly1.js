var socket = io.connect('/webapp');

//// nhận trả lời của server về việc đăng nhập
socket.on("server-send-dangnhap-fail", function(){
  //alert("đăng nhập thất bại");
});
socket.on("server-send-dangnhap-success", function(data){
  $('#currentUser').html(data.userid);
  $('#loginForm').hide(2000);
  $('#viewForm').show(1000);
});
socket.on("server-send-thoat",function(){

})
//nhận thông tin cập nhật từ Server
socket.on("server-send-updateSensor", function(data){
  // truyền thông số vào #content
  $('#humidity').html(data.humidity);
  $('#temperature').html(data.temperature);
})
//thống kê thông tin
socket.on("server-send-thongKe", function(data){
  // truyền thông số vào #content
  $('#humidity1').html(data.inf_sensor.humidity);
  $('#temperature1').html(data.inf_sensor.temperature);
  $('#date1').empty();
  var dateEnd = new Date();
  var ngay = "From : "+ data.d +"</br> To: "+ dateEnd  ;
  $('#date1').html(ngay);
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

  $('#btnUpdateSensor').click(function(data){
    $('#date').empty();
    $('#date').html(Date());
    socket.emit("client-request-updateSensor")
  });

  $('#btnThongKe').click(function(data){
    socket.emit("client-request-thongKe")
  });
});

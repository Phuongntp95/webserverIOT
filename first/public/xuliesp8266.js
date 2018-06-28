$scope.updateSensor  = function() {
  mySocket.emit("RAIN")
}

////Khu 3 -- Nhận dữ liệu từ Arduno gửi lên (thông qua ESP8266 rồi socket server truyền tải!)
//các sự kiện từ Arduino gửi lên (thông qua esp8266, thông qua server)
mySocket.on('RAIN', function(json) {
  $scope.CamBienMua = (json.digital == 1) ? "Không mưa" : "Có mưa rồi yeah ahihi"
})
	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với Arduino (thông qua socket server)
mySocket.on('connect', function() {
  console.log("connected")
  mySocket.emit("RAIN") //Cập nhập trạng thái mưa
})

if(navigator.serviceWorker != null){
  navigator.serviceWorker.register('/qrcode/sw.js')
  .then(function(registartion){
  }).catch(function (err){
    console.log('fail')
  });
}
$(document).ready(function() {
  createQrcode($("#qr-input").val(), $("#qr-size").val(), $("#qr-level").val(), $("#fc").val(), $("#bc").val())
});

function createQrcode(f, a, g, b, d) {
  var e = 1 + parseInt(g);
  $("#qrcode").html("");
  var c = new QRCode(document.getElementById("qrcode"), {
    width: a,
    height: a,
    colorDark: b,
    colorLight: d,
    correctLevel: e
  });
  c.makeCode(f)
}
$("#qr-input,#qr-size,#qr-level,#fc,#bc").on("change keyup", function() {
  createQrcode($("#qr-input").val(), $("#qr-size").val(), $("#qr-level").val(), $("#fc").val(), $("#bc").val())
});
$("#qr-saveImg").click(function() {
  $("#qrcode").find("img").each(function() {
    var c = $(this).attr("src");
    var b = document.createElement("a");
    var d = new MouseEvent("click");
    b.download = "小安二维码";
    b.href = c;
    b.dispatchEvent(d)
  })
});

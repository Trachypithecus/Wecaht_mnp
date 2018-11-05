function formatTime(date) {
  var myDate = new Date();
  var tY = myDate.getFullYear();//年
  var tM = myDate.getMonth() + 1;//月
  if (tM >= 1 && tM <= 9) {
    tM = "0" + tM;
  }
  var tD = myDate.getDate();//日
  if (tD >= 1 && tD <= 9) {
    tD = "0" + tD;
  }
  var tH = myDate.getHours();            //时
  if (tH >= 1 && tH <= 9) {
    tH = "0" + tH;
  }
  var tm = myDate.getMinutes();          //分
  if (tm >= 1 && tm <= 9) {
    tm = "0" + tm;
  }
  var tS = myDate.getSeconds();           //秒
  if (tS >= 1 && tS <= 9) {
    tS = "0" + tS;
  }
  //时间
  return tY + '-' + tM + '-' + tD + '  ' + tH + ':' + tm + ':' + tS; // 整合的东东
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
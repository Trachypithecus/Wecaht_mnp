function addMenu(){

}

function OrderCache(){
  //获取OrderCache
  wx.request({
    url: 'https://www.qqmxd.com/mydata/OrderCache',
    method: 'POST',
    data: {
      Desk: app.globalData.Desk,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: res => {
      console.log('OrderCache+sum:' + res.data)
      var sum = 0.00
      for (var i in res.data) {
        sum = parseFloat(sum) + parseFloat(res.data[i].fields.Price * res.data[i].fields.Num)
      }
      this.setData({
        Shoplist: res.data,
        sumMonney: sum,
      });
    }
  })
}

function clearMenu(){

}

module.exports = {
  OrderCache: OrderCache
}
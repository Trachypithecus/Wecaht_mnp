// pages/order/detail/detail.js
const app = getApp();
var util = require('../../../utils/util.js');
var nowtime = require('../../../utils/time.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    sumMonney: 0,
    Number: 0,
    list:[]
  },

  weiPay: function(){
    // // 展示本地存储能力
    var OrderId = wx.getStorageSync('OrderId')
    // logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('临时登录凭证 code：', res)
        wx.request({
          url: 'https://www.qqmxd.com/login/pay',
          data: {
            //price: 2,//分为单位
            orderid: OrderId,
            //openid: ozyFs5TYEn7emhCTHPkDJ498oDFc,
          },
          method: 'GET',
          success: function (res) {
            // 从后台获取支付所需的参数
            console.log('支付参数：', res)
            // 调用支付接口进行支付
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success: function (res) {
                console.log('支付成功：', res)
                wx.request({
                  url: 'https://www.qqmxd.com/login/pays', //仅为示例，并非真实的接口地址
                  data: {
                    orderid: OrderId,
                  },
                  method: 'GET',
                  success(res) {
                    console.log("PaySucc")
                  }
                })
              },
              fail: function (res) {
                console.log('支付失败：', res)
              },
              complete: function (res) { },
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = app.globalData.OrderId;
    console.log(time)
    wx.setStorageSync('OrderId',time)
    var Nowtime = nowtime.formatTime(new Date());
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    this.setData({
      cartList: wx.getStorageSync('cartList'),
      sumMonney: wx.getStorageSync('sumMonney'),
      Number: wx.getStorageSync('Number'),
      time: time,
      nowtime: Nowtime
    })
    wx.request({
      url: 'https://www.qqmxd.com/mydata/OrderDetail', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        OrderId: time,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log('OrderDetail:' + res.data)
        this.setData({
          Shoplist: res.data
        });
      }
    })
  },

  golist: function () {
    wx.switchTab({
      url: '../../index/index'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
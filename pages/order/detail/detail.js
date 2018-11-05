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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = app.globalData.OrderId;
    console.log(time)
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
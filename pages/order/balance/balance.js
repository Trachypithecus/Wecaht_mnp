// pages/order/balance/balance.js
const app = getApp();
var util = require('../../../utils/util.js');
var shoplisto=0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Shoplist:[],
    cartList: [],
    sumMonney: 0,
    Number: 0,
    beizhu:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    this.setData({
      cartList: wx.getStorageSync('cartList'),
      sumMonney: wx.getStorageSync('sumMonney'),
      Number: wx.getStorageSync('Number'),
    })
    //获取OrderCache
    wx.request({
      url: 'https://www.qqmxd.com/mydata/OrderCache', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        Desk: app.globalData.Desk,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log('OrderCache:' + res.data)
        this.setData({
          Shoplist: res.data,
        });
      }
    })
  },
  bindTextAreaBlur: function (e) {
    wx.setStorageSync("beizhu", e.detail.value), 
    console.log(wx.getStorageSync("beizhu"))
  },
  gopay: function () {
    var OrderId = util.formatTime(new Date())
    app.globalData.OrderId = OrderId
    //获取OrderCache
    wx.request({
      url: 'https://www.qqmxd.com/mydata/OrderCache', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        Desk: app.globalData.Desk,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        shoplisto = res.data
        console.log('OrderCache:' + res.data)
        this.setData({
          Shoplist: res.data,
        });
        if (shoplisto!=0) {
          wx.request({
            url: 'https://www.qqmxd.com/mydata/setOrder',
            method: 'POST',
            data: {
              Desk: app.globalData.Desk,
              OrderId: OrderId,
              OpenId: app.globalData.OpenId,
              Total: wx.getStorageSync('sumMonney'),
              CM:wx.getStorageSync("beizhu")
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data)
              wx.navigateTo({
                url: '../detail/detail'
              })
            }
          })
        }
        else {
          wx.showModal({
            title: '请勿重复提交订单',
            duration: 3000,
            success: function (res) {
              wx.navigateBack({
                delta: 5,
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
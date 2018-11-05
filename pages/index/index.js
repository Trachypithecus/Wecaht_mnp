//index.js
//获取应用实例
const app = getApp()
wx.getSetting({
  success: res => {
    if (res.authSetting['scope.userInfo']) {
      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      wx.getUserInfo({
        success: res => {
          app.globalData.NIckName = res.userInfo.nickName
          //登录
          wx.request({
            url: 'https://www.qqmxd.com/login', //仅为示例，并非真实的接口地址
            data: {
              code: app.globalData.Code,
              nickName: app.globalData.NIckName
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: res => {
              app.globalData.OpenId = res.data
              console.log('index:' + res.data)
            },
          })
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (app.userInfoReadyCallback) {
            app.userInfoReadyCallback(res)
          }
        }
      })
    }
  }
})
Page({
  bindBack: function () {
    wx.navigateTo({
      url: '../login/login'
    })
    console.log("1")
  },
  data: {
    //轮播图
    imgUrls: [
      '../../images/img2.jpg',
      '../../images/img3.jpg',
      '../../images/img4.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  onLoad: function () {
  },
  golist: function () {
    wx.navigateTo({
      url: '../list/list'
    })
  },
})

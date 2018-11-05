//app.js
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var OpenId
    this.globalData.Desk = options.query.Desk
    console.log("桌号:" + this.globalData.Desk)
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.Code = res.code
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // // 可以将 res 发送给后台解码出 unionId
              // this.globalData.NIckName = res.userInfo.nickName
              // //登录
              // wx.request({
              //   url: 'https://www.qqmxd.com/login', //仅为示例，并非真实的接口地址
              //   data: {
              //     code: this.globalData.Code,
              //     nickName: this.globalData.NIckName
              //   },
              //   header: {
              //     'content-type': 'application/json' // 默认值
              //   },
              //   success: res => {
              //     this.globalData.OpenId = res.data
              //     console.log(this.globalData.OpenId)
              //   },
              // })
              // // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            }
          })
        }else{
          wx.navigateTo({
            url: '../login/login'
          })
        }
      }
    })
  },
  globalData: {
    OpenId: null,
    Desk:null,
    NIckName:null,
    Code:null,
    OrderId:null,
  },
})
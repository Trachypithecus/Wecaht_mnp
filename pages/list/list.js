// pages/list/list.js
const app = getApp();
var OrderCache = require('../../utils/net.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Shoplist:[],    //缓存购物车列表
    listData: [],    //菜品
    goodsType: [],   //菜品类别
    activeIndex: 0,  //点击显示
    toView: 'a0',
    scrollTop: 100,  //垂直滚顶条初始位置
    screenWidth: 667,  //屏幕宽度
    showModalStatus: false,  //自定义弹窗
    currentType: 0,   //当前菜品类型
    currentIndex: 0,  //当前数组下标
    cartList: [],  //购物车列表
    sumMonney: 0,  //总金额
    Number: 0,  //数量
    showCart: false,  //购物车状态
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //登录
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
                  if (res.data!="None"){
                  app.globalData.OpenId = res.data
                  }
                  console.log('list:' + app.globalData.OpenId)
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
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    console.log(sysinfo)
    //显示页面数据加载中
    wx.showLoading({
      title: '努力加载中',
    })
    //this.GetCache();
    //请求菜品数据，存储在listData[]中
    wx.request({
      url: 'https://www.qqmxd.com/mydata/Menu',
      method: 'GET',
      data: {},
      //json格式
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();    //隐藏数据加载
        console.log(res)    //打印输出
        that.setData({
          listData: res.data,
          loading: true
        })
      }
    }),
      //请求菜单数据，存储在goodsType[]中
      wx.request({
        url: 'https://www.qqmxd.com/mydata/MenuType',
        method: 'GET',
        data: {},
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res)   //打印输出
          that.setData({
            loading: true,
            goodsType: res.data
          })
        }
      })
  },
  //左侧菜品类别与菜品联动
  selectMenu: function (e) {
    //取到index下标值，将index赋值给activeIndex，并且屏幕显示index下标的数据，滚动到指定index
    var index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      activeIndex: index,
      toView: 'a' + index,
      // scrollTop: 1186
    })
    console.log(this.data.toView);  //打印输出
  },
  //屏幕滚动
  // scroll: function (e) {
  //   console.log(e)
  //   var dis = e.detail.scrollTop
  //   if (dis > 0 && dis < 1189) {
  //     this.setData({
  //       activeIndex: 0,
  //     })
  //   }
  //   //设置数据范围
  //   if (dis > 1189 && dis < 1867) {
  //     this.setData({
  //       activeIndex: 1,
  //     })
  //   }
  //   if (dis > 1867 && dis < 2180) {
  //     this.setData({
  //       activeIndex: 2,
  //     })
  //   }
  //   if (dis > 2180 && dis < 2785) {
  //     this.setData({
  //       activeIndex: 3,
  //     })
  //   }
  //   if (dis > 2785 && dis < 2879) {
  //     this.setData({
  //       activeIndex: 4,
  //     })
  //   }
  //   if (dis > 2879 && dis < 4287) {
  //     this.setData({
  //       activeIndex: 5,
  //     })
  //   }
  //   if (dis > 4287 && dis < 4454) {
  //     this.setData({
  //       activeIndex: 6,
  //     })
  //   }
  //   if (dis > 4454 && dis < 4986) {
  //     this.setData({
  //       activeIndex: 7,
  //     })
  //   }
  //   if (dis > 4986) {
  //     this.setData({
  //       activeIndex: 8,
  //     })
  //   }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   * 选择添加按钮事件
   */
  selectInfo: function (e) {
    var type = e.currentTarget.dataset.type;  //当前菜品类型
    var index = e.currentTarget.dataset.index;  //当前数组下标
    this.setData({
      showModalStatus: !this.data.showModalStatus,  //设置自定义弹窗为true
      currentType: 0,    //赋值
      currentIndex: index,  //赋值
    });
  },

  /**
   * 点击‘+’添加进购物车
   */
  addToCart: function () {
    var a = this.data
    var addItem = {
      "name": a.listData[a.currentIndex].pk,  //菜名
      "price": parseFloat(a.listData[a.currentIndex].fields.Price),  //价格
      "number": 1,  //数量
      "sum": parseFloat(a.listData[a.currentIndex].fields.Price),   //单个菜品总计
    }
    //var sumMonney = a.sumMonney + parseInt(a.listData[a.currentIndex].fields.Price);  //所有总计金额
    var cartList = this.data.cartList;  //购物车列表
    cartList.push(addItem);    //

    this.setData({
      cartList: cartList,
      showModalStatus: false,   //购物车状态
      //sumMonney: sumMonney,
      // Number: a.Number + 1      //菜品数量加一
    });
    //console.log(this.data.cartList)
    //添加数据到OrderCache
    wx.request({
      url: 'https://www.qqmxd.com/mydata/addMenu', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        Desk: app.globalData.Desk,
        MenuName: a.listData[a.currentIndex].pk,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    //this.GetCache();
  },
  /**
   * 显示购物车弹窗
   */
  showCartList: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(this.data.showCart)
    if (1) {
      this.setData({
        showCart: !this.data.showCart,
      });
      //this.GetCache();
    }

  },
  /**
   * 清空购物车
   */
  clearCartList: function () {
    this.setData({
      cartList: [],
      showCart: false,
      sumMonney: 0,
      Number:0
    });
    //添加数据到OrderCache
    wx.request({
      url: 'https://www.qqmxd.com/mydata/cleanMenu', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        Desk: app.globalData.Desk,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  /**
   * 数量加一
   */
  addNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)

    //添加数据到OrderCache
    wx.request({
      url: 'https://www.qqmxd.com/mydata/addMenu', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        Desk: app.globalData.Desk,
        MenuName: index,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      }
    })

    //this.GetCache();
  },
  /**
   * 数量减一
   */
  decNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)

    //更新数据到OrderCache
    wx.request({
      url: 'https://www.qqmxd.com/mydata/delMenu',
      method: 'POST',
      data: {
        Desk: app.globalData.Desk,
        MenuName: index,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      }
    })

    //this.GetCache();
  },
  /**
   * 结算
   */
  goBalance: function () {
    //总金额不为0，提交数据到balance
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('sumMonney', this.data.sumMonney);
      wx.setStorageSync('Number', this.data.Number);
      wx.navigateTo({
        url: '../order/balance/balance'
      })
    }

    //this.GetCache();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    //每隔一分钟刷新一次
      setInterval(function () {
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
            console.log('OrderCache+sum:' + res)
            var sum = 0.00
            for (var i in res.data) {
              sum = parseFloat(sum) + parseFloat(res.data[i].fields.Price * res.data[i].fields.Num)
            }
            _this.setData({
              Shoplist: res.data,
              sumMonney: sum,
              Number: res.data.length
            });
            return res.data
          }
        })
      }, 600)
  },
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
  onShareAppMessage: function () {},
    /**
   * 显示购物车弹窗
   */
  GetCache: function (e) {
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
          console.log('OrderCache+sum:' + res)
          var sum=0.00
          for (var i in res.data) {
            sum = parseFloat(sum) + parseFloat(res.data[i].fields.Price * res.data[i].fields.Num)
          }
          this.setData({
            Shoplist: res.data,
            sumMonney: sum,
            Number: res.data.length
          });
        }
    })
    }
})
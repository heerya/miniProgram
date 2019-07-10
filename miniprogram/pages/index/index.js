//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '用微信号登录',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  tapAvatarImg:function(){
    wx.navigateTo({
      url: '../mhome/mhome',
    })
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.navigateTo({
        url: '../mhome/mhome',
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.addUser()
    wx.navigateTo({
      url: '../mhome/mhome',
    })
  },
  addUser: function () {
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'add_admin',
      data: {
        author: app.globalData.userInfo
      },
    }).then(res => {
      const result = res.result;
      if (result.code) {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '添加用户失败！',
        icon: 'none'
      })
    })
  },
})
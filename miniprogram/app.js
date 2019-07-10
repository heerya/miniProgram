//app.js
App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'xlx-639f73',
        traceUser: true,
      })
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    wx.request({
      url: 'http://ip-api.com/json',
      success: function(e) {
        that.globalData.ip = e.data.query
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          that.globalData.code = res.code
          wx.request({
            url: "https://api.weixin.qq.com/sns/jscode2session", //换openid的接口地址
            data: {
              appid: getApp().globalData.appId,
              secret: getApp().globalData.secret,
              js_code: res.code,
              grant_type: "authorization_code"
            },
            success: (res) => {
              that.globalData.openid = res.data.openid; //将openid存起来
              that.globalData.session_key = res.data.session_key;
            },
            fail: (res) => {
              console.error('openid,session_key' + res);
            }
          })
          wx.request({
            url: "https://api.weixin.qq.com/cgi-bin/token", //换openid的接口地址
            data: {
              appid: getApp().globalData.appId,
              secret: getApp().globalData.secret,
              grant_type: "client_credential"
            },
            success: (res) => {
              that.globalData.access_token = res.data.access_token
            },
            fail: (res) => {
              console.error('access_token' + res);
            }
          })
        }
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
              this.globalData.addUser(res.userInfo);
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
  globalData: {
    ip: '60.247.41.161',
    userInfo: null,
    appId: 'wx58bad907a53580ce',
    secret: "2c41ded8e400f021b9ba818c4fd1ca76",
    openid: '',
    session_key: '',
    access_token: '',
    addUser: function (userInfo) {
      wx.cloud.init({
        env: 'xlx-639f73',
        traceUser: true,
      })
      wx.cloud.callFunction({
        name: 'add_admin',
        data: {
          author: userInfo
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
    register(userInfo){
      if (userInfo){
        return true;
      }else{
        wx.showModal({
          title: '确认',
          content: '使用微信头像昵称登录',
          success(res) {
            if (res.confirm) {
              wx.getUserInfo({
                success: res => {
                  wx.cloud.init({
                    env: 'xlx-639f73',
                    traceUser: true,
                  })
                  wx.cloud.callFunction({
                    name: 'add_admin',
                    data: {
                      author: res.userInfo
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
                }
              })
              return true;
            } else if (res.cancel) {
              wx.showToast({
                title: '登录失败',
                icon: 'none',
                duration: 1000
              })
              return false
            }
          }
        })
      }
    }
  }
})
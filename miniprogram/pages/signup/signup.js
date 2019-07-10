// pages/signup/signup.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    items: [{
        name: 'man',
        value: '男',
        checked: 'true'
      },
      {
        name: 'female',
        value: '女'
      }
    ],
    activity_id: '',
    activity_data: {}
  },
  payMoney: function() {
    var money = this.data.activity_data.money * 100;
    var that = this;
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'wechat_pay',
      data: {
        openid: app.globalData.openid,
        total_fee: money,
        ip: app.globalData.ip
      },
      complete: res => {
        console.log(res);
        wx.requestPayment({
          timeStamp: res.result.data.timeStamp,
          nonceStr: res.result.data.nonceStr,
          package: res.result.data.package,
          signType: 'MD5',
          paySign: res.result.data.paySign,
          success: function(e) {
            that.setData({
              disabled: false
            })
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    })
  },
  submitSignUp(e) {
    var formdata = e.detail.value;
    formdata['activity_id'] = this.data.activity_id;
    formdata['person'] = app.globalData.userInfo;
    formdata['time'] = new Date().toLocaleDateString();
    formdata['type'] = 'activity';
    var formId = e.detail.formId;
    var d = {
      "keyword1": {
        "value": formdata['time']
      },
      "keyword2": {
        "value": this.data.activity_data.title
      },
      "keyword3": {
        "value": formdata.realname
      },
      "keyword4": {
        "value": formdata.tel
      },
      "keyword5": {
        "value": formdata.wx
      }
    };
    if (!formdata.realname || !formdata.tel || !formdata.wx) {
      return wx.showToast({
        title: '姓名，手机号，微信号等内容均不能为空',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '提交中'
    })
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'add_signup',
      data: formdata,
    }).then(res => {
      console.log('ok!', res)
      const result = res.result;
      if (result.code) {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
      }
      //发送模版信息
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + app.globalData.access_token,
        data: {
          touser: app.globalData.openid,
          template_id: 'V8vnRMi4Uto6GGuiX2uzq3dfoAjY95FUDZw7SKCO_Yc', //报名发起成功通知，  
          page: '/pages/activity/activity?id=' + this.data.activity_id,
          form_id: formId,
          data: d,
          color: '#ccc',
          emphasis_keyword: 'keyword2.DATA'
        },
        method: 'POST',
        success: function(res) {
          wx.hideLoading();
          console.log("发送成功");
          console.log(res);
        },
        fail: function(err) {
          // fail  
          console.log("push err")
          console.log(err);
        }
      });
      wx.hideLoading()
      wx.navigateBack({
        delta: 1
      })
    }).catch(err => {
      console.log('error!', err);
      wx.hideLoading()
      wx.showToast({
        title: '提交失败！',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.register(app.globalData.userInfo)) { //验证注册
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        activity_id: options.activity_id
      })
      const db = wx.cloud.database({});
      db.collection('activity').where({
        _id: options.activity_id
      }).get().then((res) => {
        this.setData({
          activity_data: res.data[0]
        })
        wx.hideLoading()
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: 'db读取失败',
          icon: 'none'
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
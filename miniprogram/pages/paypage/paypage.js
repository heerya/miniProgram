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
    product_id: '',
    product_data: {}
  },
  payMoney: function() {
    var money = this.data.product_data.money * 100;
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
            console.log(e);
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
    formdata['product_id'] = this.data.product_id;
    formdata['person'] = app.globalData.userInfo;
    formdata['time'] = new Date().toLocaleDateString();
    formdata['type'] = 'product';
    var formId = e.detail.formId;
    var d = {
      "keyword1": {
        "value": formdata['time']
      },
      "keyword2": {
        "value": this.data.product_data.title
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
        product_id: options.product_id
      })
      const db = wx.cloud.database({});
      db.collection('product').where({
        _id: options.product_id
      }).get().then((res) => {
        this.setData({
          product_data: res.data[0]
        })
        wx.hideLoading()
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: '数据读取失败',
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
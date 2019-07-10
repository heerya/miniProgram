// pages/activity/activity.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {},
    activityId: '',
    commentL: null
  },
  toSignUp: function() {
    wx.navigateTo({
      url: '../signup/signup?activity_id=' + this.data.activityId,
    })
  },
  writeComment: function(e) {
    const activity_id = this.data.activityId;
    wx.showLoading({
      title: '发布中'
    })
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'add_comment',
      data: {
        author: app.globalData.userInfo,
        ctime: new Date().toLocaleDateString(),
        ctext: e.detail.value,
        activity_id: activity_id
      },
    }).then(res => {
      this.getCommentLikeData();
      const result = res.result;
      if (result.code) {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
      }
      wx.hideLoading()
    }).catch(err => {
      console.log('error!', err);
      wx.hideLoading()
      wx.showToast({
        title: '发布失败！',
        icon: 'none'
      })
    })
  },
  likeComActivity: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'add_comment_like',
      data: {
        comment_id: e.target.id,
        open_id: app.globalData.openid
      }
    }).then(res => {
      this.getCommentLikeData();
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '失败！',
        icon: 'none'
      })
    })
  },
  likeActivity: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'add_like',
      data: {
        activity_id: e.target.id,
        author: app.globalData.userInfo
      }
    }).then(res => {
      wx.cloud.init({
        env: 'xlx-639f73',
        traceUser: true,
      })
      wx.cloud.callFunction({
        name: 'get_activity',
        data: {
          userinfo: app.globalData.userInfo
        }
      }).then(res => {
        this.setData({
          activity: res.result[0]
        })
        wx.hideLoading()
      }).catch(err => {
        console.log('error!', err);
        wx.hideLoading()
        wx.showToast({
          title: '展示活动失败',
          icon: 'none'
        })
      })
    }).catch(err => {
      console.log('error!', err);
      wx.hideLoading()
      wx.showToast({
        title: '失败！',
        icon: 'none'
      })
    })
  },
  getCommentLikeData: function(id) {
    var activity_id = this.data.activityId || id;
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'get_comment',
      data: {
        userinfo: app.globalData.userInfo,
        activity_id: activity_id
      }
    }).then(res => {
      console.log(res.result);
      this.setData({
        commentL: res.result
      })
      wx.hideLoading()
    }).catch(err => {
      console.log('error!', err);
      wx.hideLoading()
      wx.showToast({
        title: '展示活动失败',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    if (app.globalData.register(app.globalData.userInfo)) { //验证注册
      const ac = {
        target:{
          id: options.id
        }
      }
      this.likeActivity(ac);
      this.getCommentLikeData(options.id);
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
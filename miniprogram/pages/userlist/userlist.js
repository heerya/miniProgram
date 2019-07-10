// pages/userlist/userlist.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataL: []

  },
  userMoreInfo(e) {
    wx.navigateTo({
      url: '../userinfo/userinfo?id=' + e.target.id,
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
      const db = wx.cloud.database({});
      if (options.type == 'activity') {
        db.collection('signup').where({
          activity_id: options.id
        }).get().then((res) => {
          this.setData({
            dataL: res.data
          })
          wx.hideLoading()
          if (!res.data){
            wx.showToast({
              title: '没有人报名',
              icon: 'none'
            })
          }
        }).catch(e => {
          wx.hideLoading()
          wx.showToast({
            title: 'db读取失败',
            icon: 'none'
          })
        })
      } else if (options.type == 'product') {
        db.collection('signup').where({
          product_id: options.id
        }).get().then((res) => {
          this.setData({
            dataL: res.data
          })
          wx.hideLoading()
          if (!res.data) {
            wx.showToast({
              title: '没有人购买',
              icon: 'none'
            })
          }
        }).catch(e => {
          wx.hideLoading()
          wx.showToast({
            title: 'db读取失败',
            icon: 'none'
          })
        })
      }
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
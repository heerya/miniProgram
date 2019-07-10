// pages/admin/admin.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataL: []
  },
  delAdmin: function (e) {
    console.log(e);
    wx.showLoading({
      title: '删除中'
    })
    var userinfo = app.globalData.userInfo;
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'update_admin',
      data: {
        id: e.target.dataset.id,
        new_admin: 1
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: "删除成功",
        icon: 'none'
      })
      this.getData();
    }).catch(err => {
      console.log('error!', err);
      wx.hideLoading()
      wx.showToast({
        title: '删除失败！',
        icon: 'none'
      })
    })
  },
  addAdmin: function (e) {
    console.log(e);
    wx.showLoading({
      title: '添加中'
    })
    var userinfo = app.globalData.userInfo;
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'update_admin',
      data: {
        id: e.target.dataset.id,
        new_admin: 3
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: "添加成功",
        icon: 'none'
      })
      this.getData();
    }).catch(err => {
      console.log('error!', err);
      wx.hideLoading()
      wx.showToast({
        title: '添加失败！',
        icon: 'none'
      })
    })
  },
  getData: function () {
    const db = wx.cloud.database({});
    db.collection('admin').get().then((res) => {
      this.setData({
        dataL: res.data
      })
      wx.hideLoading()
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: 'admin读取失败',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    if (app.globalData.register(app.globalData.userInfo)) { //验证注册
      this.getData();
    }
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
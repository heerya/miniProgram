// pages/product/product.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    productId: '',
    // commentL: null
  },
  payProduct: function() {
    wx.navigateTo({
      url: '../paypage/paypage?product_id=' + this.data.productId,
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
      db.collection('product').where({
        _id: options.id
      }).get().then((res) => {
        this.setData({
          product: res.data[0],
          productId: options.id
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
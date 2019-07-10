// pages/add_activity/add_activity.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startD: '2019-02-20',
    endD: '2020-02-20',
    images: [],
  },
  bindStartDateChange(e) {
    console.log('起始时间：', e.detail.value)
    this.setData({
      startD: e.detail.value
    })
  },
  bindEndDateChange(e) {
    console.log('结束时间：', e.detail.value)
    this.setData({
      endD: e.detail.value
    })
  },
  uploadPicFile: function(e) {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: dRes => {
        var tempFilePaths = dRes.tempFilePaths;
        that.setData({
          images: that.data.images.concat(tempFilePaths)
        });
      },
      fail: console.error
    })
  },
  delete: function(e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images
    });
  },
  formSubmit: function(e) {
    const that = this;
    const formData = e.detail.value;
    if (!formData.title || !formData.maintext || !that.data.images) {
      return wx.showToast({
        title: '封面，标题，摘要等内容均不能为空',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '图片上传中',
    })
    const filePath = that.data.images,
      cloudPath = [],
      imgid = [];
    filePath.forEach((item, i) => {
      cloudPath.push(`${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}-${i}.png`)
    })
    var flag = filePath.length;
    cloudPath.forEach(function(ele, index) {
      wx.cloud.uploadFile({
        cloudPath: ele,
        filePath: filePath[index],
        success: res => {
          if (res.statusCode < 300) {
            imgid.push(res.fileID);
            flag --;
          }
          if(flag == 0){
            wx.hideLoading();
            wx.showToast({
              title: `图片上传成功`,
              icon: 'none'
            })
            that.addActivityItem(imgid, formData);
          }
        },
        fail: err => {
          wx.hideLoading();
          wx.showToast({
            title: `图片上传失败`,
            icon: 'none'
          })
        }
      })
    })
  },
  addActivityItem: function (imgid, formData){
    wx.showLoading({
      title: '内容发布中'
    })
    //imgid是图片的fileid的集合数组
    var userinfo = app.globalData.userInfo;
    var nowtime = new Date().toLocaleDateString();
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'add_activity',
      data: {
        author: userinfo,
        title: formData.title,
        maintext: formData.maintext,
        money: formData.money,
        start_time: this.data.startD,
        end_time: this.data.endD,
        edit_time: nowtime,
        img_id: imgid
      },
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
        title: '添加失败！',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.register(app.globalData.userInfo);
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
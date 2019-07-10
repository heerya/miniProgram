// pages/mhome/mhome.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'90vh',
    headerTab: 0,
    productList:[],//商品
    dataL: [], //所有的活动
    myList: [], //自己建的活动
    newAlist:[],//有效期内的活动
    useradmin: 0, //权限管理 7最高 3普通管理员 1用户
    isAdmin: false,
    isHighAdmin: false
  },
  swiperTab: function (e) {
    this.setData({
      headerTab: e.detail.current
    })
  },
  clickTab: function (e) {
    var that = this;
    if (this.data.headerTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        headerTab: e.target.dataset.current
      })
    }
  },
  addActivity: function () {
    wx.navigateTo({
      url: '../add_activity/add_activity',
    })
  },
  addProduct:function(){
    wx.navigateTo({
      url: '../add_product/add_product',
    })
  },
  toProduct: function (e) {
    wx.navigateTo({
      url: '../product/product?id=' + e.target.id,
    })
  },
  toActivity: function (e) {
    wx.navigateTo({
      url: '../activity/activity?id=' + e.target.id,
    })
  },
  toProductUser: function (e) {
    wx.navigateTo({
      url: '../userlist/userlist?id=' + e.target.id+'&type=product',
    })
  },
  toActivityUser: function (e) {
    wx.navigateTo({
      url: '../userlist/userlist?id=' + e.target.id + '&type=activity',
    })
  },
  toAdmin: function () {
    wx.navigateTo({
      url: '../admin/admin',
    })
  },
  changeUse: function (e) {
    var that = this;
    wx.showModal({
      title: '确认过期这个活动？',
      content: '不能撤销此次操作，过期活动后，活动会出现在精选活动中',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '过期中'
          })
          var userinfo = app.globalData.userInfo;
          wx.cloud.init({
            env: 'xlx-639f73',
            traceUser: true,
          })
          wx.cloud.callFunction({
            name: 'update_activity',
            data: {
              activity_id: e.target.id
            }
          }).then(res => {
            wx.hideLoading()
            wx.showToast({
              title: "过期成功",
              icon: 'none'
            })
            that.getData();
          }).catch(err => {
            console.log('error!', err);
            wx.hideLoading()
            wx.showToast({
              title: '过期失败！',
              icon: 'none'
            })
          })
        } else if (res.cancel) {
          console.log('取消过期')
        }
      }
    })
  },
  delActivity(e) {
    var that = this;
    wx.showModal({
      title: '确认删除这个活动？',
      content: '此操作不能撤销',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除'
          })
          var userinfo = app.globalData.userInfo;
          wx.cloud.init({
            env: 'xlx-639f73',
            traceUser: true,
          })
          wx.cloud.callFunction({
            name: 'del_activity',
            data: {
              activity_id: e.target.id
            }
          }).then(res => {
            wx.hideLoading()
            console.log(res);
            wx.showToast({
              title: "删除成功",
              icon: 'none'
            })
            that.getData();
          }).catch(err => {
            console.log('error!', err);
            wx.hideLoading()
            wx.showToast({
              title: '删除失败！',
              icon: 'none'
            })
          })
        } else if (res.cancel) {
          console.log('取消删除')
        }
      }
    })
  },
  delProduct(e) {
    var that = this;
    wx.showModal({
      title: '确认删除这个商品？',
      content: '此操作不能撤销',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除'
          })
          var userinfo = app.globalData.userInfo;
          wx.cloud.init({
            env: 'xlx-639f73',
            traceUser: true,
          })
          wx.cloud.callFunction({
            name: 'del_product',
            data: {
              product_id: e.target.id
            }
          }).then(res => {
            wx.hideLoading()
            console.log(res);
            wx.showToast({
              title: "删除成功",
              icon: 'none'
            })
            that.getData();
          }).catch(err => {
            console.log('error!', err);
            wx.hideLoading()
            wx.showToast({
              title: '删除失败！',
              icon: 'none'
            })
          })
        } else if (res.cancel) {
          console.log('取消删除')
        }
      }
    })
  },
  getData: function () {
    const db = wx.cloud.database({});
    db.collection('product').orderBy('edit_time', 'desc').get().then((res) => {
      this.setData({
        productList : res.data
      })
      wx.hideLoading()
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '商品读取失败',
        icon: 'none'
      })
    })
    wx.cloud.init({
      env: 'xlx-639f73',
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'get_activity',
      data:{
        userinfo: app.globalData.userInfo
      }
    }).then(res => {
      var newAlist = [];
      res.result.forEach(function (ele) {
        if (ele.use) {
          newAlist.push(ele);
        }
      })
      this.setData({
        dataL: res.result,
        newAlist: newAlist
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
    db.collection('admin').where({
      openid: app.globalData.openid
    }).get().then((res) => {
      if (((1 << 1) & res.data[0].admin) !== 0){
        this.setData({
          isAdmin: true,//3是第二权限
        })
      }
      if (((1 << 2) & res.data[0].admin) !== 0) {
        this.setData({
          isHighAdmin: true //7是最高权限
        })
      }
      this.setData({
        useradmin: res.data[0].admin
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
    let that = this;
    if(app.globalData.register(app.globalData.userInfo)){ //验证注册
      wx.showLoading({
        title: '加载中',
      })
        // 获取系统信息
      wx.getSystemInfo({
        success: function (res) {
          // 获取可使用窗口宽度
          let clientHeight = res.windowHeight;
          // 获取可使用窗口高度
          let clientWidth = res.windowWidth;
          // 算出比例
          let ratio = 750 / clientWidth;
          // 算出高度(单位rpx)
          let height = clientHeight * ratio;
          // 设置高度
          that.setData({
            height: height+'rpx'
          });
        }
      });
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
    if (this.data.dataL.length != 0 || this.data.myList.length != 0 || this.data.productList.length !=0) {
      this.getData();
    }
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
    console.log('刷新');
    this.data.myList = [];
    this.data.dataL = [];
    this.data.useradmin = 0;
    this.data.isAdmin = false;
    this.data.isHighAdmin = false;
    this.getData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        title: res.target.dataset.title,
        path: '/pages/activity/activity?id=' + res.target.id,
        imageUrl: res.target.dataset.url
      }
    }
  }
})
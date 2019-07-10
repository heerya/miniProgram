// components/activity/bigImg.js
import {bigImgBehavior} from "../../behaviors/bigImg_behavior.js"
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [bigImgBehavior],
  /**
   * 组件的方法列表
   */
  methods: {
    toActivity: function (e) {
      wx.navigateTo({
        url: '../activity/activity?id=' + e.target.id,
      })
    },
  }
})

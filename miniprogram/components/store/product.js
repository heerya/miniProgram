// components/store/product.js
import { bigImgBehavior } from "../../behaviors/bigImg_behavior.js"
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [bigImgBehavior],
  /**
   * 组件的方法列表
   */
  methods: {
    toProduct: function (e) {
      wx.navigateTo({
        url: '../product/product?id=' + e.target.id,
      })
    },
  }
})

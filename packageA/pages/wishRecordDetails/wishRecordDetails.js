// packageA/pages/wishRecordDetails/wishRecordDetails.js
const app = getApp()
const utils = require('../../../utils/util.js')
const config = require('../../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentNavtab: options.currentNavtab,
      ordersId: options.ordersId 
    })
    if (this.data.currentNavtab == 0) {
      wx.setNavigationBarTitle({
        title: '当前愿望',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '领取记录',
      })
    }
  },
  /**
   * 获取详情
   */
  getRecordInfo: function () {
    utils.httpRequestGet(config.config.getWishRecordDetails, { token: this.data.token, ordersId: this.data.ordersId}, 
    (res) => {
      if (res.data.status == 200) {
        this.setData({
          recordInfo: res.data.bean
        })
  
      }
    })
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
    var token = wx.getStorageSync("token") || 'paixi_123'
    this.setData({
      token: token
    })
    this.getRecordInfo()
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
    wx.stopPullDownRefresh()
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
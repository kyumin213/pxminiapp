// pages/receiveSuccess/receiveSuccess.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goBack: function () {
    wx.reLaunch({
      url: '/pages/gifts/gifts',
    })
  },
  gotoGame: function () {
    if (this.data.addressWay == 3) {
      wx.reLaunch({
        url: '/pages/pintuGame/pintuGame?ordersId=' + this.data.ordersId,
      })
    } else if (this.data.addressWay == 4) {
      wx.reLaunch({
        url: '/pages/answerGame/answerGame?ordersId=' + this.data.ordersId,
      })
    } else if (this.data.addressWay == 10) {
      wx.reLaunch({
        url: '/pages/diceGame/diceGame?ordersId=' + this.data.ordersId,
      })
    }
  },
  goIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      addressWay: options.addressWay,
      ordersId: options.ordersId
    })
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
    wx.stopPullDownRefresh()
  },

})
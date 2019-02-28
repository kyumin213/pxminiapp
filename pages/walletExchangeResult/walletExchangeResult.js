// pages/walletExchangeResult/walletExchangeResult.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      msg: options.msg || '',
      status: options.status || 0,
      amount: options.amount || 0,
      rechargeMoney: options.rechargeMoney || 0
    })
  },
  gobackIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  gobackWallet: function () {
    // wx.navigateTo({
    //   url: '/pages/wallet/wallet',
    // })
    wx.navigateBack({
      delta: 2
    })
  },
  gobackWalletExchange: function () {
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '/pages/walletExchange/walletExchange',
    // })
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
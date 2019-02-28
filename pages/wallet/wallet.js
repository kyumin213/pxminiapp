// pages/wallet/wallet.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  gotoDetails: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/walletDetails/walletDetails',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  bindClickExchange: function () {
    wx.navigateTo({
      url: '/pages/walletExchange/walletExchange',
    })
  },
  getCash: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/walletGetCash/walletGetCash',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      }) 
    }    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.toLowerCase().indexOf('iphone x') > -1) {
          this.setData({
            iphonex: true
          })
        }
      }
    })
  },
  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 查看钱包余额
   */
  getAccountInfo: function () {
    utils.httpRequestPost(config.config.postAccountDetail, { token: this.data.token }, (res) => {
      if (res.data.status == 200) {
        this.setData({
          accounts: res.data.bean
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getAccountInfo, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.hideShareMenu()
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        this.getAccountInfo()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123',
          accounts: { amount: "0", freezeAmount: "0", money: "0", redMoney: "0"}
        })
      }
    })  
    var isLogin = wx.getStorageSync("isLogin") || false 
    this.setData({
      isLogin: isLogin
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
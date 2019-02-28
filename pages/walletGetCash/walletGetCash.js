// pages/walletGetCash/walletGetCash.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ["兑换金额", "红包金额"],
    currentNavtab: 1,
    disable: true,
    array: ["1.00元", "2.00元", "5.00元"],
    cashValue: '0.00'
  },

  /**
   * 金额选择
   */
  bindPickerChange: function (e) {
    var index = e.detail.value
    this.setData({
      index: e.detail.value,
      isSelect: true
    })
    var cashValue = parseInt(this.data.array[index]).toFixed(2)
    this.setData({
      cashValue: cashValue
    })
  },
  /**
   * 弹出提现确认框
   */
  popComfirmBox: function () {
    this.setData({
      showPopCash: true
    })
  },
  /**
   * 导航切换
   */
  swichNav: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentNavtab: index
    })    
    if (index == 1) {
      wx.setNavigationBarTitle({
        title: '红包提现'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '兑换提现'
      })
    }    
  },
  /**
   * 取消
   */
  closePop: function () {
    this.setData({
      showPopCash: false
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
   * 提现
   */
  getCash: function () {
    if (this.data.isLogin) {
      utils.httpRequestPost(config.config.postGetCash, 
        { token: this.data.token, money: this.data.cashValue}, 
        (res) => {
          this.setData({
            showPopCash: false
          })
      // 403, "红包余额不足，无法提现" 501, "您无相应提现卡，无法提现可前往许愿树获取提现卡" 502, "您的提现卡已过期，无法提现"
          if (res.data.status == 200) {
            var redMoney = res.data.bean.redMoney
            var keyCode = res.data.bean.keyCode
            wx.navigateTo({
              url: '/pages/walletGetCashResult/walletGetCashResult?cashValue=' + this.data.cashValue + '&status=0&keyCode=' + keyCode + '&redMoney=' + redMoney,
            })
          } else if (res.data.status == 403) {
            wx.navigateTo({
              url: '/pages/walletGetCashResult/walletGetCashResult?cashValue=' + this.data.cashValue + '&status=1',
            })
          } else if (res.data.status == 501) {
            wx.navigateTo({
              url: '/pages/walletGetCashResult/walletGetCashResult?cashValue=' + this.data.cashValue + '&status=2',
            })
          } else if (res.data.status == 502) {
            wx.navigateTo({
              url: '/pages/walletGetCashResult/walletGetCashResult?cashValue=' + this.data.cashValue + '&status=3',
            })
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.getCash, this)
          } else {
            utils.showTips(res.data.msg)
          }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync('token') || 'paixi_123'
    var isLogin = wx.getStorageSync('isLogin') || false
    this.setData({
      token: token,
      isLogin: isLogin
    })
    wx.hideShareMenu()
    this.getAccountInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
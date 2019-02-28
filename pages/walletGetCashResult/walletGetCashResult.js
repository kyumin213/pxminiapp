// pages/walletGetCashResult/walletGetCashResult.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    
    // contents: '74B3j742'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cashValue: options.cashValue || '',
      status: options.status,
      keyCode: options.keyCode || '',
      redMoney: options.redMoney || 0
    })
  },
  /**
   * 复制提现码
   */
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  gobackTree: function () {
    if (this.data.canClick) {
      this.getUserStatus()
    }
  },
  /**
   * 判断用户种树状态 0：全新玩家；1：没有许愿树；2：有许愿树；3：有成熟的果实;4：已摘取；5：已脱落；
   */
  getUserStatus: function () {
    this.setData({
      canClick: false
    })
    wx.request({
      url: config.config.getWishTreeStatus,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean == 0) {
            wx.navigateTo({
              url: '/packageA/pages/wishing/wishing?isNew=' + true,
            })
          } else if (res.data.bean == 1 || res.data.bean == 4) {
            wx.navigateTo({
              url: '/packageA/pages/wishing/wishing',
            })
          } else if (res.data.bean == 2 || res.data.bean == 3 || res.data.bean == 5) {
            wx.navigateTo({
              url: '/packageA/pages/wishTree/wishTree',
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getUserStatus, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      canClick: true
    })
    wx.hideShareMenu()
  },
  /**
   * 返回首页
   */
  gobackIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 返回钱包
   */
  gobackWallet: function () {
    wx.navigateBack({
      delta: 2
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
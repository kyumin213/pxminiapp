// pages/walletExchange/walletExchange.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // done: true
    cardNumber: '',
    cardPwd: '',
    cardCode: ''
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
  /**
   * 下一步
   */
  showPop: function () {
    if (this.data.done) {
      // 兑换
      this.reChargeFirstTime()
    }   
  },
  /**
   * 初次调用兑换接口
   */
  reChargeFirstTime: function () {
    if (this.data.isLogin) {
      utils.httpRequestPost(config.config.postRechargeFirst,
        {
          token: this.data.token,
          cardId: this.data.cardNumber,
          password: this.data.cardPwd,
          keyCode: this.data.cardCode
        }, (res) => {
          if (res.data.status == 200) {
            this.setData({
              cardId: res.data.bean.cardId,
              rechargeMoney: res.data.bean.rechargeMoney,
              showConfirm: true,
            })
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.reChargeFirstTime, this)
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
  closePop: function () {
    this.setData({
      showConfirm: false
    })
  },
  /**
   * 确定兑换
   */
  goExchange: function () {
    this.setData({
      showConfirm: false
    })
    this.reChargeConfirm()
  },
  /**
   * 充值二次确认
   */
  reChargeConfirm: function () {
    utils.httpRequestPost(config.config.postRechargeConfirm,
      {
        token: this.data.token,
        cardId: this.data.cardNumber,
        password: this.data.cardPwd,
        keyCode: this.data.cardCode
      }, (res) => {
        if (res.data.status == 200) {
          wx.navigateTo({
            url: '/pages/walletExchangeResult/walletExchangeResult?msg=' + res.data.msg + '&status=0' + '&amount=' + res.data.bean.amount + '&rechargeMoney=' + res.data.bean.rechargeMoney,
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.reChargeFirstTime, this)
        } else if (res.data.status == 406){
          // 兑换卡已使用
          wx.navigateTo({
            url: '/pages/walletExchangeResult/walletExchangeResult?msg=' + res.data.msg + '&status=1',
          })
        } else if (res.data.status == 408) {
          // 兑换码不存在 密码错误
          wx.navigateTo({
            url: '/pages/walletExchangeResult/walletExchangeResult?msg=' + res.data.msg + '&status=2',
          })
        } else if (res.data.status == 504) {
          // 兑换卡已过期
          wx.navigateTo({
            url: '/pages/walletExchangeResult/walletExchangeResult?msg=' + res.data.msg + '&status=3',
          })
        } else if (res.data.status == 505) {
          // 限制次数
          wx.navigateTo({
            url: '/pages/walletExchangeResult/walletExchangeResult?msg=' + res.data.msg + '&status=4',
          })
        } else {
          utils.showTips(res.data.msg)
        }
      })
  },
  /**
   * 监听礼品卡号输入
   */
  bindNumberInput: function (e) {    
    if (e.detail.value != '') {
      this.setData({
        showOne: true,
      })
    }
    this.setData({
      cardNumber: e.detail.value,
    })
    if (this.data.cardNumber.length == 14 && this.data.cardPwd.length == 8 && this.data.cardCode.length == 8) {
      this.setData({
        done: true
      })
    } else {
      this.setData({
        done: false
      })
    }
  },
  /**
   * 监听礼品卡失去焦点
   */
  bindNumberBlur: function () {
    this.setData({
      showOne: false
    })
  },
  /**
   * 删除礼品卡号输入
   */
  clearCardNumber: function () {
    this.setData({
      cardNumber: '',
      showOne: false,
      focusNumber: true
    })
  },
  /**
   * 监听密匙输入
   */
  bindPwdInput: function (e) {
    if (e.detail.value != '') {
      this.setData({
        showTwo: true
      })      
    }
    this.setData({
      cardPwd: e.detail.value,
    })
    if (this.data.cardNumber.length == 14 && this.data.cardPwd.length == 8 && this.data.cardCode.length == 8) {
      this.setData({
        done: true
      })
    } else {
      this.setData({
        done: false
      })
    }
  },  
  /**
   * 监听密匙失去焦点
   */
  bindPwdBlur: function () {
    this.setData({
      showTwo: false
    })
  },
  /**
   * 删除密匙输入
   */
  clearCardPwd: function() {
    this.setData({
      cardPwd: '',
      showTwo: false,
      focusPwd: true
    })
  },
  /**
   * 监听密匙输入
   */
  bindCodeInput: function (e) {
    if (e.detail.value != '') {
      this.setData({
        showThree: true
      })
    }
    this.setData({
      cardCode: e.detail.value,
    })
    if (this.data.cardNumber.length == 14 && this.data.cardPwd.length == 8 && this.data.cardCode.length == 8) {
      this.setData({
        done: true
      })
    } else {
      this.setData({
        done: false
      })
    }
  },
  /**
   * 监听密匙失去焦点
   */
  bindCodeBlur: function () {
    this.setData({
      showThree: false
    })
  },
  /**
   * 删除密匙输入
   */
  clearCardCode: function () {
    this.setData({
      cardCode: '',
      showThree: false,
      focusCode: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync("token") || 'paixi_123'
    var isLogin = wx.getStorageSync("isLogin") || false
    this.setData({
      token: token,
      isLogin: isLogin
    })
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
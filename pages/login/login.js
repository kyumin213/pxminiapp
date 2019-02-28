// pages/login/login.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phoneEncryptedData: '',
    phoneIv: '',
    showPop: false    
  },

  onLoad: function (options) {
    this.setData({
      recommend: options.treeUserId || '123456'
    })
    console.log(this.data.recommend)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        console.log(res.data)
        this.setData({
          token: res.data
        })
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  bindgetuserinfo: function (e) {
    this.setData({
      showPop: false
    })
    if (e.detail.userInfo) {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            encryptedData: res.encryptedData,
            iv: res.iv,
            showPop: false
          })
          wx.login({
            success: (res) => {
              if (res.code) {
                this.loginFun(res.code, this.data.encryptedData, this.data.iv, 'paixi_123', this.data.recommend)
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    } else {
      utils.showModelStr('友情提示', '您点击了拒绝授权，将无法显示个人信息，点击确定重新获取授权', '确定', '取消', (res) => {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              console.log(res)
              if (res.authSetting["scope.userInfo"]) {
                this.getUserInfoFun()
              }
            }
          })
        } else {
          console.log('用户点击取消')
        }
      })
    }
  },
  getPhoneNumber: function (e) {
    console.log(e)
    if (e.detail.encryptedData) {
      var phoneEncryptedData = e.detail.encryptedData
      var phoneIv = e.detail.iv
      this.setData({
        tipsmode: true,
        showPop: true,
        phoneEncryptedData: phoneEncryptedData,
        phoneIv: phoneIv
      })
      console.log(phoneEncryptedData, phoneIv)
    } else {
      this.setData({
        tipsmode: false,
        showPop: true
      })
    }
  },
  loginFun: function (code, encryptedData, iv, token, recommend) {
    wx.request({
      url: config.config.postCreateUser,
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv,
        token: token,
        phoneEncryptedData: this.data.phoneEncryptedData,
        phoneIv: this.data.phoneIv,
        recommend: recommend
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (data) => {
        if (data.data.status == 200) {
          app.globalData.token = data.data.bean
          app.globalData.isLogin = true
          wx.setStorage({
            key: "token",
            data: data.data.bean
          })
          wx.setStorage({
            key: "isLogin",
            data: true
          })
          this.setData({
            token: data.data.bean
          })
          wx.navigateBack({
            delta:1
          })
        } else if (data.data.status == 801) {
          this.getUserInfoFun()
        }
      }
    })
  },
  getUserInfoFun: function () {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        wx.setStorage({
          key: 'userInfo',
          data: res.userInfo,
        })
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          encryptedData: res.encryptedData,
          iv: res.iv
        })
        wx.login({
          success: (res) => {
            if (res.code) {
              this.loginFun(res.code, this.data.encryptedData, this.data.iv, this.data.token, this.data.recommend)
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
  }
})
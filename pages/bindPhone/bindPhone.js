// pages/bindPhone/bindPhone.js
const app = getApp()
var config = require("../../utils/config.js")
const utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    codeNumber: '',
    bgcolor: '',
    isActive: false,
    btnText: '获取验证码',
    txtcolor: '',
    userPhone: '',
    canClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = options.title
    this.setData({
      title: title
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      btnText: '获取验证码'
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
      },
      fail: (res) => {
        this.setData({
          token: app.globalData.token
        })
      }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 监听输入手机号 改变绑定按钮的样式
   */
  bindPhoneInput: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  /**
   * 监听输入验证码 改变绑定按钮的样式
   */
  bindCodeInput: function (e) {
    this.setData({
      codeNumber: e.detail.value
    }) 
    if (this.data.codeNumber != '' && this.data.phoneNumber != '') {
      this.setData({
        bgcolor: 'background: #F72F2B',
        isActive: true
      }) 
    } else {
      this.setData({
        bgcolor: 'background: #D8D8D8',
        isActive: false
      }) 
    }
  },
  getCode: function () {
    if (this.data.phoneNumber == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
    } else {
      var phoneNumber = this.data.phoneNumber
      var re = /^1\d{10}$/
      if (re.test(phoneNumber)) {
        if (this.data.canClick) {
          wx.request({
            url: config.config.postGetCode,
            data: {
              token: this.data.token,
              phone: this.data.phoneNumber
            },
            method: 'POST',
            dataType: 'json',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
              console.log(res.data)
              if (res.data.status == 200) {
                console.log('success')
                this.setData({
                  canClick: false
                })
                var timer = null, i = 60
                timer = setInterval(() => {
                  if (i > 0) {
                    i--
                    this.setData({
                      btnText: i + 's重发',
                      txtcolor: 'color:#999;border:2rpx solid #eee;background:#fff;'
                    })
                  } else {
                    this.setData({
                      btnText: '重新发送',
                      txtcolor: 'background: #F72F2B;color: #fff;',
                      canClick: true
                    })
                    clearInterval(timer)
                  }
                }, 1000)
              } else if (res.data.status == 801) {
                // this.getUserInfoFun(this.getCode)
                utils.getUserInfoFun(this.getCode, this)
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
      }
    }
  },
  bindPhone: function () {
    if (this.data.phoneNumber == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
    } else if (this.data.codeNumber == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
      })
    } else {
      wx.request({
        url: config.config.postSumbitCode,
        data: {
          token: this.data.token,
          code: this.data.codeNumber,
          phone: this.data.phoneNumber
        },
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.status == 200) {
            this.getUserPhone()
            wx.showToast({
              title: '绑定成功',
              icon: 'none',
              success: () => {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else if (res.data.status == 801) {
            // this.getUserInfoFun(this.bindPhone)
            utils.getUserInfoFun(this.bindPhone, this)            
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }
  },
  // 获取手机号
  getUserPhone: function () {
    wx.request({
      url: config.config.getUserPhone,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          app.globalData.userPhone = res.data.bean
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.getUserPhone)
          utils.getUserInfoFun(this.getUserPhone, this)                      
        }
      }
    })
  }
})
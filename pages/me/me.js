// pages/me/me.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    flag: false,
    hiddenmodalput: true,
    userPhone: '',
    encryptedData: '',
    iv: '',
    MessageNumber: 0,
    collectNumber: 0,
    pendingPay: '',
    pendingReceive: '',
    completed: '',
    isLoading: false
  },
  gotoLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        if (res.data) {
          this.setData({
            userInfo: res.data,
            hasUserInfo: true,
          })
        }
      },
    })
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        this.setData({
          isLogin: res.data,
        })
      },
      fail: (res) => {
        this.setData({
          isLogin: false,
          accounts: '0.00'
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        if (app.globalData.userPhone) {
          this.setData({
            userPhone: app.globalData.userPhone
          })
        } else {
          this.getUserPhone()
        }
        this.getOrderNumber(0)
        this.getOrderNumber(1)
        // this.getCollectNum()
        // this.getMessageNum()
        // 获取优惠券可用数量
        this.getCouponNumber()
        // 获取红包金额
        this.getAccountInfo()
      },
      fail: (res) => {
        this.setData({
          accounts: '0.00'
        })
      }
    })
  },
  // 去许愿树页面
  goWishRecord: function () {    
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/packageA/pages/wishRecord/wishRecord',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }   
  },
  /**
   * 去到我的钱包
   */
  goMoneyPackage: function() {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/wallet/wallet',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }    
  },
  /**
   * 查看钱包余额
   */
  getAccountInfo: function () {
    utils.httpRequestPost(config.config.postAccountDetail, {token: this.data.token}, (res) => {
      if (res.data.status == 200) {
        this.setData({
          accounts: res.data.bean.amount
        })
      } else if(res.data.status == 801) {
        utils.getUserInfoFun(this.getAccountInfo, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  goCoupon: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/couponList/couponList?pageFrom=1',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  goMessageList: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '../message/message',
      })  
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  goFeedBack: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '../feedback/feedback',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 我的地址
  goAddress: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  goService: function () {
    utils.showModelStr('', '0755-86540417', '呼叫', '取消', function (res) {
      if (res.confirm) {
        wx.makePhoneCall({
          phoneNumber: '0755-86540417', //此号码并非真实电话号码，仅用于测试  
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }  
        })
      } else {
        console.log('用户点击取消')
      }
    })
  },
  goAbout:function(){
    wx.navigateTo({
      url: '../about/about',
    })
  },
  goOrderList: function (e) {
    if (this.data.isLogin) {
      var index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../order/order?currentNavtab=' + index,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 礼物记录 送出的
   */
  goRecordList: function (e) {
    if (this.data.isLogin) {
      var category = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../recordSendOut/recordSendOut?category=' + category,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 礼物记录 收到的
   */
  goRecordListReceived: function (e) {
    if (this.data.isLogin) {
      var category = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../recordReceived/recordReceived?category=' + category,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 礼物记录 参与的
   */
  goRecordListJoin: function (e) {
    if (this.data.isLogin) {
      var category = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../recordJoin/recordJoin?category=' + category,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  goCollection: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/collection/collection',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 获取订单数量
   */
  getOrderNumber: function (indexs) {
    wx.request({
      url: config.config.getOrderNumber,
      data: {
        token: this.data.token,
        status: indexs
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (indexs == 0) {
            if (res.data.bean != 0) {
              this.setData({
                pendingPay: res.data.bean
              })
            } else {
              this.setData({
                pendingPay: ''
              })
            }
          } else if (indexs == 1) {
            if (res.data.bean != 0) {
              this.setData({
                pendingReceive: res.data.bean
              })
            } else {
              this.setData({
                pendingReceive: ''
              })
            }
          } else if (indexs == 2) {
            if (res.data.bean != 0) {
              this.setData({
                completed: res.data.bean
              })
            } else {
              this.setData({
                completed: ''
              })
            }
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getOrderNumber, this)
        }
      }
    })
  },
  /**
   * 获取收藏数量
   */
  getCollectNum: function () {
    wx.request({
      url: config.config.getCollectNum,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            collectNumber: res.data.bean
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getCollectNum, this)
        }
      }
    })
  },
  /**
   * 获取用户消息数量
   */
  getMessageNum: function () {
    wx.request({
      url: config.config.getMessageNum,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            MessageNumber: res.data.bean
          })
        }
      }
    })
  },
  /**
   * 获取手机号
   */
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
          wx.stopPullDownRefresh()
          app.globalData.userPhone = res.data.bean
          this.setData({
            userPhone: res.data.bean
          })
        } else if (res.data.status != 801){
          app.globalData.userPhone = ''
          this.setData({
            userPhone: ''
          })
        }
      }
    })
  },
  bindPhone: function () {
    if (this.data.isLogin) {
      if (this.data.userPhone != '') {
        var title = '修改绑定的手机号'
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone?title=' + title,
        })
      } else {
        var title = '绑定手机号'
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone?title=' + title,
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 获取优惠券数量
   */
  getCouponNumber: function () {
    wx.request({
      url: config.config.getUserCanUserCoupon,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            couponTotal: res.data.bean
          })
        }
      }
    })
  }
})
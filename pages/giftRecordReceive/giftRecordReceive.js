const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: ["未开奖", "已开奖", "已中奖", "已发货", "未发货", "未中奖", "已退款"],
    statusTips: ["好友正在寻找你", "礼物已成功送出", "恭喜你！礼物已悄悄领取！", "礼物正在途中，请耐心等待", "小派正在为你准备礼物中", "礼物已被悄悄领走，再接再厉哦！", "",]
  },
  getRecordDetails: function () {
    wx.request({
      url: config.config.getReceiveDetails,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var itemList = res.data.bean.itemVoList
          var orderInfo = res.data.bean
          var userMaker = res.data.bean.userMaker
          this.setData({
            orderInfo: orderInfo,
            itemList: itemList,
            userMaker: userMaker
          })
          var param = {}
          for (var i in itemList) {
            param.propName = JSON.parse(itemList[i].productParamText).propName
            this.setData({
              ['itemList[' + i + '].productParamText']: param
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getRecordDetails, this)
        }
      }
    })
  },
  sendCard: function (e) {
    var ordersId = e.currentTarget.dataset.id
    var status = this.data.orderInfo.giftStatus
    wx.navigateTo({
      url: '/pages/giftCard/giftCard?ordersId=' + ordersId + '&status=' + status,
    })
  },
  gotoCardReceivers: function (e) {
    var ordersId = e.currentTarget.dataset.id
    var status = this.data.orderInfo.giftStatus
    if (this.data.orderInfo.addressWay == 2) { 
      wx.navigateTo({
        url: '/pages/openBox/openBox?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 1) {
      wx.navigateTo({
        url: '/pages/giftsCardReceiver/giftsCardReceiver?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 3)  {
      wx.navigateTo({
        url: '/pages/pintuGame/pintuGame?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 4) {
      wx.navigateTo({
        url: '/pages/answerGame/answerGame?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 5) {
      wx.navigateTo({
        url: '/pages/activity/activity?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 6) {
      wx.navigateTo({
        url: '/pages/activityPintu/activityPintu?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 7) {
      wx.navigateTo({
        url: '/pages/activityAnswer/activityAnswer?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 8) {
      wx.navigateTo({
        url: '/pages/groupReceiver/groupReceiver?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 9) {
      wx.navigateTo({
        url: '/pages/activityDice/activityDice?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 10) {
      wx.navigateTo({
        url: '/pages/diceGame/diceGame?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 11) {
      wx.navigateTo({
        url: '/pages/directReceiver/directReceiver?ordersId=' + ordersId,
      })
    }
  },
  /**
   * 获取用户默认地址
   */
  getUserAddress: function () {
    wx.request({
      url: config.config.getUserDefaultAddress,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean) {
            this.setData({
              addressId: res.data.bean.id,
              hasDefaultAddress: true
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getUserAddress, this)
        } else {
          this.setData({
            hasDefaultAddress: false
          })
        }
      }
    })
  },
  /**
   * 添加收货地址
   */
  gotoAddAddress: function () {
    // if (this.data.orderInfo.addressWay == 3) {
      // 判断是否有地址 有则调用修改地址接口 没有则调用增加地址接口
      if (this.data.hasDefaultAddress) {
        var _this = this
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.address']) {
              wx.authorize({
                scope: 'scope.address',
                success() {
                  console.log('success')
                },
                fail() {
                  utils.showModelStr('友情提示', '您点击了拒绝授权，将无法获取地址信息，点击确定重新获取授权', '确定', '取消', (res) => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          console.log(res)
                          if (res.authSetting["scope.address"]) {
                            // this.addAddress()
                          }
                        }
                      })
                    } else {
                      console.log('用户点击取消')
                    }
                  })
                }
              })
            } else {
              wx.chooseAddress({
                success: (res) => {
                  _this.setData({
                    addressInfo: res,
                    hasAddress: true
                  })
                  console.log(_this.data.addressInfo)
                  _this.setData({
                    addressDetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                    userphone: res.telNumber,
                    username: res.userName
                  })
                  wx.request({
                    url: config.config.postModifyAddress,
                    method: 'POST',
                    data: {
                      token: _this.data.token,
                      receiver: _this.data.addressInfo.userName,
                      phone: _this.data.addressInfo.telNumber,
                      province: _this.data.addressInfo.provinceName,
                      city: _this.data.addressInfo.cityName,
                      district: _this.data.addressInfo.countyName,
                      detailed: _this.data.addressInfo.detailInfo,
                      longitude: '',
                      latitude: '',
                      location: '',
                      isDefault: 1,
                      id: _this.data.addressId
                    },
                    dataType: 'json',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: (res) => {
                      console.log(res.data)
                      if (res.data.status == 200) {
                        console.log('1')
                        _this.addWinnerAddress()
                      } else if (res.data.status == 801) {
                        utils.getUserInfoFun(_this.modifyAddress, _this)
                      } else {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    }
                  })
                }
              })
            }
          }
        })
      } else {
        var _this = this
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.address']) {
              wx.authorize({
                scope: 'scope.address',
                success() {
                  console.log('success')
                },
                fail() {
                  utils.showModelStr('友情提示', '您点击了拒绝授权，将无法获取地址信息，点击确定重新获取授权', '确定', '取消', (res) => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          console.log(res)
                          if (res.authSetting["scope.address"]) {
                            // this.addAddress()
                          }
                        }
                      })
                    } else {
                      console.log('用户点击取消')
                    }
                  })
                }
              })
            } else {
              wx.chooseAddress({
                success: (res) => {
                  _this.setData({
                    addressDetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                    userphone: res.telNumber,
                    username: res.userName,
                    addressInfo: res,
                    hasAddress: true
                  })
                  wx.request({
                    url: config.config.postAddaddress,
                    method: 'POST',
                    data: {
                      token: _this.data.token,
                      receiver: _this.data.addressInfo.userName,
                      phone: _this.data.addressInfo.telNumber,
                      province: _this.data.addressInfo.provinceName,
                      city: _this.data.addressInfo.cityName,
                      district: _this.data.addressInfo.countyName,
                      detailed: _this.data.addressInfo.detailInfo,
                      longitude: '',
                      latitude: '',
                      location: ''
                    },
                    dataType: 'json',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: (res) => {
                      console.log(res.data)
                      if (res.data.status == 200) {
                        var id = res.data.bean.id
                        _this.setData({
                          addressId: id
                        })
                        // 调用提交中奖地址接口
                        _this.addWinnerAddress()
                      } else if (res.data.status == 801) {
                        utils.getUserInfoFun(_this.modifyAddress, _this)
                      } else {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    }
                  })
                }
              })
            }
          }
        })
      }
  },
  /**
   * 提交地址
   */
  addWinnerAddress: function () {
    if (this.data.orderInfo.addressWay == 3) {
      // var urls = config.config.postPintuAddress
      var urls = config.config.postGiftOrderAddress      
    } else if (this.data.orderInfo.addressWay == 4 || this.data.orderInfo.addressWay == 10) {
      // var urls = config.config.postAnswerAddress
      var urls = config.config.postGiftOrderAddress
    } else if (this.data.orderInfo.addressWay == 5 || this.data.orderInfo.addressWay == 6 || this.data.orderInfo.addressWay == 7 || this.data.orderInfo.addressWay == 9) {
      var urls = config.config.postActivityAddress
    } else if (this.data.orderInfo.addressWay == 11) {
      var urls = config.config.postAddressDirect
    }
    wx.request({
      url: urls,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        addressId: this.data.addressId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.showToast({
            title: '地址提交成功！',
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ordersId: options.ordersId
    })
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
        this.getRecordDetails()
        // 获取是否有默认地址
        this.getUserAddress()
      },
      fail: (res) => {
        // this.getUserInfoFun(this.getRecordDetails)
        utils.getUserInfoFun(this.getRecordDetails, this)
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

})
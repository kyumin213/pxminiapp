// pages/giftRecord/giftRecord.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navName: [{
      title: '待发货',
      category: '2',
      status: '4'
    },
    {
      title: '已发货',
      category: '2',
      status: '3'
    }],
    currentNavtab: 0,
    recordList: [],
    status: ["未开奖", "已开奖", "已中奖", "已发货", "待发货", "未中奖", "已退款"],
    playMethod: ["", "悄悄送礼", "开箱送礼", "拼图送礼", "答题送礼", "吐槽送礼", "拼图送礼", "答题送礼", "群送礼", "摇骰子送礼", "摇骰子送礼","直接送礼"]
  },
  swichNav: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentNavtab: index
    })
    var status = this.data.navName[index].status
    this.getGiftRecord(status)
  },
  gotoGift: function () {
    wx.reLaunch({
      url: '/pages/gifts/gifts',
    })
  },
  // 去到悄悄送礼礼物卡页面
  gotoQiaoQiao: function (e) {
    var ordersId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/giftsCardReceiver/giftsCardReceiver?ordersId=' + ordersId,
    })
  },
  // 去到开箱送礼礼物卡页面
  gotoBox: function (e) {
    var ordersId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/openBox/openBox?ordersId=' + ordersId,
    })
  },
  // 去到拼图送礼礼物卡页面
  gotoPintu: function (e) {
    var ordersId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pintuGame/pintuGame?ordersId=' + ordersId,
    })
  },
  // 去到答题送礼礼物卡页面
  gotoAnswer: function (e) {
    var ordersId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/answerGame/answerGame?ordersId=' + ordersId,
    })
  },
  // 选择收礼人
  gotoSelsect: function (e) {
    var ordersId = e.currentTarget.dataset.id
    console.log(ordersId)
    wx.navigateTo({
      url: '/pages/giftCardStatus/giftCardStatus?status=0&ordersId=' + ordersId,
    })
  },
  // 送出礼物卡
  gotoSendCard: function (e) {
    var ordersId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/giftCard/giftCard?ordersId=' + ordersId,
    })
  },
  // 送出礼物卡 开箱送礼
  gotoSendCardBox: function (e) {
    var ordersId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/giftCardBox/giftCardBox?ordersId=' + ordersId,
    })
  },
  // 送出礼物卡 拼图送礼
  gotoSendCardPintu: function (e) {
    var ordersId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/giftCardPintu/giftCardPintu?ordersId=' + ordersId,
    })
  },
  // 送出礼物卡 答题送礼
  gotoSendCardAnswer: function (e) {
    var ordersId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/giftCardAnswer/giftCardAnswer?ordersId=' + ordersId,
    })
  },
  // 送出礼物卡 群送礼
  gotoSendCardGroup: function (e) {
    var ordersId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/giftCardGroup/giftCardGroup?ordersId=' + ordersId,
    })
  },
  // 待发货 详情
  gotoRecordDetails: function (e) {
    var index = e.currentTarget.dataset.index
    var ordersId = this.data.recordList[index].orderId
    wx.navigateTo({
      url: '/pages/giftRecordReceive/giftRecordReceive?ordersId=' + ordersId,
    })
  },
  // 已发货 详情
  gotoRecordDetailsComplete: function (e) {
    var index = e.currentTarget.dataset.index
    var ordersId = this.data.recordListReceived[index].orderId
    wx.navigateTo({
      url: '/pages/giftRecordReceive/giftRecordReceive?ordersId=' + ordersId,
    })
  },
  
  gotoRecordJoin: function (e) {
    var index = e.currentTarget.dataset.index
    var ordersId = this.data.recordListJoin[index].orderId
    wx.navigateTo({
      url: '/pages/giftRecordJoin/giftRecordJoin?ordersId=' + ordersId,
    })
  },
  gotoRecordReceived: function (e) {
    var index = e.currentTarget.dataset.index
    var ordersId = this.data.recordListReceived[index].orderId
    wx.navigateTo({
      url: '/pages/giftRecordReceive/giftRecordReceive?ordersId=' + ordersId,
    })
  },
  gotoDetails: function () {
    wx.navigateTo({
      url: '/pages/giftCardStatus/giftCardStatus?status=0',
    })
  },
  getGiftRecord: function (status) {
    wx.request({
      url: config.config.getGiftRecords,
      data: {
        token: this.data.token,
        category: 2,
        status: status
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        wx.stopPullDownRefresh()
        if (res.data.status == 200 && status == 4) {
          // 待发货
          if (res.data.bean) {
            var recordList = res.data.bean
            this.setData({
              recordList: recordList,
            })
            var param = {}
            for (var i in recordList) {
              for (var j in recordList[i].itemVoList) {
                param.propName = JSON.parse(recordList[i].itemVoList[j].productParamText).propName
                param.price = JSON.parse(recordList[i].itemVoList[j].productParamText).price
                // 设置解析后的属性的值
                this.setData({
                  ['recordList[' + i + '].itemVoList[' + j + '].productParamText']: param
                })
              }
            }
          }
        } else if (res.data.status == 200 && status == 3) {
          // 已发货
          if (res.data.bean) {
            var recordListReceived = res.data.bean
            this.setData({
              recordListReceived: recordListReceived
            })
            var param = {}
            for (var i in recordListReceived) {
              for (var j in recordListReceived[i].itemVoList) {
                param.propName = JSON.parse(recordListReceived[i].itemVoList[j].productParamText).propName
                param.price = JSON.parse(recordListReceived[i].itemVoList[j].productParamText).price
                // 设置解析后的属性的值
                this.setData({
                  ['recordListReceived[' + i + '].itemVoList[' + j + '].productParamText']: param
                })
              }
            }
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getGiftRecord, this)
        }
      }
    })
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
   * 查看物流
   */
  gotoLogiticts: function (e) {
    var ordersId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/logistics/logistics?ordersId=' + ordersId,
    })
  },
  /**
   * 添加收货地址 拼图
   */
  gotoAddAddress: function (e) {
    // 判断是否有地址 有则调用修改地址接口 没有则调用增加地址接口
    var ordersId = e.currentTarget.dataset.orderid
    console.log(ordersId)
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
                      _this.addWinnerAddress(ordersId, config.config.postPintuAddress)
                    } else if (res.data.status == 801) {
                      utils.getUserInfoFun(_this.gotoAddAddress, _this)
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
                      _this.addWinnerAddress(ordersId, config.config.postAnswerAddress)
                    } else if (res.data.status == 801) {
                      utils.getUserInfoFun(_this.gotoAddAddress, _this)
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
   * 添加答题地址
   */
  gotoAddAddressAnswer: function (e) {
    console.log(e)
    var ordersId = e.currentTarget.dataset.orderid
    console.log(ordersId)
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
                      // _this.addWinnerAddress(ordersId, config.config.postPintuAddress)
                      _this.addWinnerAddress(ordersId, config.config.postGiftOrderAddress)                      
                    } else if (res.data.status == 801) {
                      utils.getUserInfoFun(_this.gotoAddAddressAnswer, _this)
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
                      // _this.addWinnerAddress(ordersId, config.config.postAnswerAddress)
                      _this.addWinnerAddress(ordersId, config.config.postGiftOrderAddress)
                    } else if (res.data.status == 801) {
                      utils.getUserInfoFun(_this.gotoAddAddressAnswer, _this)
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
  addWinnerAddress: function (ordersId, urls) {
    wx.request({
      url: urls,
      data: {
        token: this.data.token,
        ordersId: ordersId,
        addressId: this.data.addressId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.navigateTo({
            url: '/pages/giftRecordReceive/giftRecordReceive?ordersId=' + ordersId,
          })
        } else if (res.data.status == 801) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        // console.log(res.data)
        this.setData({
          token: res.data
        })
        this.getGiftRecord(this.data.navName[this.data.currentNavtab].status)
      },
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var index = this.data.navName[this.data.currentNavtab].status
    this.getGiftRecord(index)
  },
})
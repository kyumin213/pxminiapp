// pages/groupReceiver/groupReceiver.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [],
    fuckText: ''
  },
  togglePop: function () {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      this.getUserAddress()
      this.setData({
        showDialog: !this.data.showDialog
      })
    }
  },
  // 留言
  togglePopMessage: function () {
    this.setData({
      showPop: !this.data.showPop
    })
  },
  /***
   *  获取祝福文本框的值
   */
  bindTextAreaBlur: function (e) {
    this.setData({
      fuckText: e.detail.value
    })
    console.log(e.detail.value)
  },
  submitMessage: function (e) {
    var fuckContent = this.data.fuckText
    if (fuckContent == '') {
      wx.showToast({
        title: '请输入您的祝福',
        icon: 'none'
      })
    } else {
      wx.request({
        url: config.config.postSubmitMessage,
        data: {
          token: this.data.token,
          ordersId: this.data.ordersId,
          fuckContent: fuckContent
        },
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            wx.showToast({
              title: '祝福成功！',
              icon: 'none'
            })
            this.setData({
              showPop: !this.data.showPop
            })
            this.getGroupInfo()
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.submitMessage, this)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            this.setData({
              showPop: !this.data.showPop
            })
          }
        }
      })
    }
  },
  gotoGift: function () {
    wx.navigateTo({
      url: '/pages/gifts/gifts',
    })
  },
  /**
   * 获取送礼情况
   */
  getGroupInfo: function () {
    wx.request({
      url: config.config.getGroupPartakeInfo,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          var ordersItems = res.data.bean.ordersItems
          this.setData({
            ordersItems: ordersItems,
            priceSplit: res.data.bean.priceSplit,
            priceTotal: res.data.bean.priceTotal,
            userPartakeStatus: res.data.bean.userPartakeStatus,
            messages: res.data.bean.userPartake,
            userGiveList: res.data.bean.userGiveList,
            userGiveDisparityNum: res.data.bean.userGiveDisparityNum
          })
          var param = {}
          for (var i in ordersItems) {
            param.propName = JSON.parse(ordersItems[i].productParamText).propName
            this.setData({
              ['ordersItems[' + i + '].productParamText']: param
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  gotoIndex: function () {
    wx.navigateTo({
      url: '/pages/index/index',
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
              addressDetail: res.data.bean.location,
              userphone: res.data.bean.phone,
              username: res.data.bean.receiver,
              hasAddress: true
            })
          }
        } else {
          this.setData({
            hasAddress: false
          })
        }
      }
    })
  },
  /**
   * 监听输入姓名 
   */
  bindNameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  /**
   * 监听输入手机号 
   */
  bindPhoneInput: function (e) {
    this.setData({
      userphone: e.detail.value
    })
  },
  /**
   * 监听输入详细地址
   */
  bindAddressInput: function (e) {
    this.setData({
      addressDetail: e.detail.value
    })
  },
  /**
   * 填地址 领礼物
   */
  confirmAddress: function () {
    var userphone = this.data.userphone
    var re = /^1\d{10}$/
    if (this.data.username == '') {
      wx.showToast({
        title: '请输入收礼人姓名',
        icon: 'none'
      })
    } else if (this.data.userphone == '') {
      wx.showToast({
        title: '请输入收礼人手机号',
        icon: 'none'
      })
    } else if (!re.test(userphone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
    } else if (this.data.addressDetail == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    } else if (this.data.addressDetail.length < 8) {
      wx.showToast({
        title: '请输入正确的地址',
        icon: 'none'
      })
    } else {
      wx.request({
        url: config.config.postAddaddress,
        method: 'POST',
        data: {
          token: this.data.token,
          receiver: this.data.username,
          phone: this.data.userphone,
          province: '',
          city: '',
          district: '',
          detailed: '',
          longitude: '',
          latitude: '',
          location: this.data.addressDetail
        },
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.status == 200) {
            var id = res.data.bean.id
            this.setData({
              addressId: id
            })
            this.fixedAddress()
          } else if (res.data.status == 801) {
            // this.getUserInfoFun(this.confirmAddress)
            utils.getUserInfoFun(this.confirmAddress, this)
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
  },
  /**
   * 提交群送礼地址
   */
  fixedAddress: function () {
    wx.request({
      url: config.config.postAddaddressGroup,
      method: 'POST',
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        addressId: this.data.addressId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.showToast({
            title: '领取成功！',
            icon: 'none'
          })
          this.setData({
            showDialog: !this.data.showDialog
          })
          this.getGroupInfo()
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.fixedAddress, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          this.setData({
            showDialog: !this.data.showDialog
          })
          this.getGroupInfo()
        }
      }
    })
  },
  /**
   * 修改地址
   */
  modifyAddress: function () {
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
                    // var id = res.data.bean.id
                    // _this.setData({
                    //   addressId: id
                    // })
                    console.log('xiugaichenggong')
                  } else if (res.data.status == 801) {
                    // _this.getUserInfoFun(_this.modifyAddress)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        this.setData({
          isLogin: res.data
        })
      },
      fail: (res) => {
        this.setData({
          isLogin: false
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (res.data) {
          this.setData({
            token: res.data
          })
        }
        this.getGroupInfo()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getGroupInfo()
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
    this.getGroupInfo()
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
    return {
      title: '请收下我们为你准备的礼物！',
      path: '/pages/groupReceiver/groupReceiver?ordersId=' + this.data.ordersId,
      imageUrl: 'https://image.prise.shop/images/2018/08/08/1533718176107717.png'
    }
  }
})
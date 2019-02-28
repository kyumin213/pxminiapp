// pages/pintuResult/pintuResult.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabledValue: false,
    // status: 0,
    bigTip: ["恭喜你！中奖了！", "很遗憾，未中奖…", "礼物已被你领取", "很抱歉，礼物领取时间已过"],
    smallTip: ["请填写正确的地址信息，领取你获得的礼物", "太可惜了，礼物竟与你擦肩而过…", "小派将按照以下地址为你派送礼物，请耐心等候～", "您在中奖后15天内未领取礼物，已将礼物退回"],
    bottomTip: ["前往查看中奖商品", "去看看都谁中了奖", "前往查看中奖商品", "前往查看中奖商品"]
  },
  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  gotoGifts: function () {
    wx.reLaunch({
      url: '/pages/gifts/gifts',
    })
  },
  gotoGameCenter: function () {
    if (this.data.addressWay == 3) {
      wx.reLaunch({
        url: '/pages/pintuGame/pintuGame?ordersId=' + this.data.ordersId,
      })
    } else if (this.data.addressWay == 4) {
      wx.reLaunch({
        url: '/pages/answerGame/answerGame?ordersId=' + this.data.ordersId,
      })
    } else if (this.data.addressWay == 10) {
      wx.reLaunch({
        url: '/pages/diceGame/diceGame?ordersId=' + this.data.ordersId,
      })
    }
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
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getUserAddress,this)
        } else {
          this.setData({
            hasAddress: false
          })
        }
      }
    })
  },
  /**
   * 确认地址
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
      this.submitAddress()
    }
  },
  submitAddress: function () {
    if (!this.data.hasAddress) {
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
            this.addWinnerAddress()
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.submitAddress, this)
          } else {
            utils.showTips(res.data.msg)
          }
        }
      })
    } else {
      // 修改地址
      wx.request({
        url: config.config.postModifyAddress,
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
          location: this.data.addressDetail,
          isDefault: 1,
          id: this.data.addressId
        },
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.status == 200) {
            console.log('1')
            this.addWinnerAddress()
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.submitAddress, _this)
          } else {
            utils.showTips(res.data.msg)
          }
        }
      })
    }    
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
                    console.log('1')
                    // var id = res.data.bean.id
                    // _this.setData({
                    //   addressId: id
                    // })
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
  },
  /**
   * 提交拼图订单地址信息
   */
  addWinnerAddress: function () {
    if (this.data.addressWay == 3) {
      var urls = config.config.postGiftOrderAddress      
    } else if (this.data.addressWay == 4) {
      var urls = config.config.postGiftOrderAddress      
    } else if (this.data.addressWay == 10) {
      var urls = config.config.postGiftOrderAddress
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
          // this.setData({
          //   status: 5
          // })
          wx.navigateTo({
            url: '/pages/receiveSuccess/receiveSuccess?addressWay=' + this.data.addressWay + '&ordersId=' + this.data.ordersId,
          })
        }
      }
    })
  },
  /**
   * 拼图开奖 判断服务通知页面跳转状态
   */
  getPageStatus: function () {
    if (this.data.addressWay == 3) {
      // var urls = config.config.getIsWinner
      var urls = config.config.getIsWinnerDice      
    } else if (this.data.addressWay == 4){
      // var urls = config.config.getIsWinnerAnswer      
      var urls = config.config.getIsWinnerDice      
    } else if (this.data.addressWay == 10) {
      var urls = config.config.getIsWinnerDice
    }
    wx.request({
      url: urls,
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
          // 中奖 未填地址
          this.setData({
            status: 0
          })
        } else if (res.data.status == 201) {
          // 很遗憾，您未中奖！
          this.setData({
            status: 1,
            disabledValue: true
          })
        } else if (res.data.status == 202) {
          // 已经开奖了
          this.setData({
            status: 2,
            disabledValue: true
          })
        } else if (res.data.status == 203) {
          // 活动结束 已退款
          this.setData({
            status: 3,
            disabledValue: true
          })
        }
      }
    })
  },
  /**
   * 获取订单详情
   */
  getOrderDetails: function () {
    if (this.data.isLogin) {
      wx.request({
        url: config.config.getGiftCardDetails,
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
            var itemList = res.data.bean.itemVoList
            this.setData({
              ordersItemNum: res.data.bean.ordersItemNum,
              itemList: itemList,
              giftStatus: res.data.bean.giftStatus,
              userMaker: res.data.bean.userMaker,
              addressWay: res.data.bean.addressWay,
            })
            this.getUserAddress()
            this.getPageStatus()
            var param = {}
            for (var i in itemList) {
              param.propName = JSON.parse(itemList[i].productParamText).propName
              this.setData({
                ['itemList[' + i + '].productParamText']: param
              })
            }
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.getOrderDetails, this)
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  showAllItem: function () {
    this.setData({
      scrollHeight: '800rpx',
      isShowMore: false
    })
    wx.request({
      url: config.config.getGiftCardDetails,
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
          var itemList = res.data.bean.itemVoList
          this.setData({
            ordersItemNum: res.data.bean.ordersItemNum,
            itemList: res.data.bean.itemVoList
          })
          var param = {}
          for (var i in itemList) {
            param.propName = JSON.parse(itemList[i].productParamText).propName
            this.setData({
              ['itemList[' + i + '].productParamText']: param
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.ordersId) {
      this.setData({
        ordersId: options.ordersId
      })
    }
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
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        this.getOrderDetails()

        // this.getUserAddress()
        // this.getPageStatus()
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
    this.getOrderDetails()
  },

})
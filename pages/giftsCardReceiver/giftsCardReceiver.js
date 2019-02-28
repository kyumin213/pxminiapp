// pages/giftsCardReceiver/giftsCardReceiver.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
// Todo 进入页面先判断授权，再判断用户是否参与过本次活动，参与了就路由到领取礼物页面，未参与则停留本页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleTxt: ["好友正在寻找你-先逛逛派喜吧！", "礼物已被悄悄领走-去逛逛派喜吧！ ","","","","","活动已结束-先逛逛派喜吧！"],
    statusTip: ["礼物等待领取中", "礼物已被领取", "", "", "", "","活动已结束"],
    isShowDialog: false,
    hasAddress: false,
    addressInfo: {},
    username: '',
    userphone: '',
    addressDetail: '',
    status: '',
    isShowMore: false,
    scrollHeight: '670rpx',
    isJoin: false
  },
  /**
   * 是否参与过该活动
   */
  isJoinParty: function () {
    wx.request({
      url: config.config.getIsJoin,
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
          this.setData({
            isJoin: false
          })
        } else if(res.data.status == 201) {
          this.setData({
            isJoin: true
          })
        } else if (res.data.status == 202) {
          this.setData({
            isJoin: true
          })
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.isJoinParty)
          utils.getUserInfoFun(this.isJoinParty, this)
        }
      }
    })
  },
  /**
   * 参与活动
   */
  joinGame: function () {
    wx.request({
      url: config.config.postJoinGame,
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
            title: '参与成功，等待开奖',
            icon: 'none'
          })
          this.setData({
            isShowDialog: !this.data.isShowDialog,
            isJoin: true
          })
          this.getCard()
        } else if (res.data.status == 503) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          this.setData({
            isShowDialog: !this.data.isShowDialog
          })
        } else if (res.data.status == 801) {
          this.joinGame()
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
  toggleDialog: function () {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      this.getUserAddress()
      this.setData({
        isShowDialog: !this.data.isShowDialog
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
  gotoGifts: function () {
    wx.reLaunch({
      url: '/pages/gifts/gifts',
    })
  },
  gontoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
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
    } else if (this.data.userphone == ''){
      wx.showToast({
        title: '请输入收礼人手机号',
        icon: 'none'
      })
    } else if (!re.test(userphone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
    } else if (this.data.addressDetail == ''){
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    } else if (this.data.addressDetail.length<8) {
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
            this.joinGame()
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
      // status: options.status,
      ordersId: options.ordersId
    })
    for (var i in this.data.titleTxt) {
      this.setData({
        ['titleTxt[' + i + ']']: this.data.titleTxt[i].split("-")
      })
    }
  },
  /**
   * 获取订单详情
   */
  getCard: function () {
    wx.request({
      url: config.config.getGiftCardInfo,
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
          var itemList = res.data.bean.ordersView.itemVoList
          if (itemList.length > 3) {
            this.setData({
              isShowMore: true
            })
          }
          var itemlistsub = itemList.splice(0, 3)
          this.setData({
            ordersItemNum: res.data.bean.ordersView.ordersItemNum,
            status: res.data.bean.ordersView.giftStatus,
            itemList: itemlistsub,
            userPartake: res.data.bean.userPartake
          })
          var param = {}
          for (var i in itemlistsub) {
            param.propName = JSON.parse(itemlistsub[i].productParamText).propName
            this.setData({
              ['itemList[' + i + '].productParamText']: param
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getCard, this)
        }
      }
    })
  },
  showAllItem: function () {
    this.setData({
      scrollHeight: '800rpx',
      isShowMore: false
    })
    wx.request({
      url: config.config.getGiftCardInfo,
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
          var itemList = res.data.bean.ordersView.itemVoList
          this.setData({
            ordersItemNum: res.data.bean.ordersView.ordersItemNum,
            status: res.data.bean.ordersView.giftStatus,
            itemList: itemList,
            userPartake: res.data.bean.userPartake
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (res.data) {
          this.setData({
            token: res.data
          })
        }
        this.isJoinParty()
        this.getCard()
      },
      fail: (res) => {
        this.setData({
          isJoin: false
        })
        this.getCard()
      }
    })
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        console.log(res.data)
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
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
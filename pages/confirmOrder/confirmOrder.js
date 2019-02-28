// pages/confirmOrder/confirmOrder.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCart: '',
    isShowExit: false,
    itemList: [],
    ordersPay: '',
    isSeaAmoy: false,
    addressInfo: {},
    hasAddress: false,
    idcardNumber: '',
    remarks: '',
    isLoading: false,
    canClick: true,
    canClickPayBtn: true,
    checked: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isCart: options.isCart,
      isOpen: options.isOpen
    })
    // if (options.isSeckill) {
    //   this.setData({
    //     isSeckill: options.isSeckill
    //   })
    // } else {
    //   this.setData({
    //     isSeckill: null
    //   })
    // }
  },
  addAddress: function () {
    var _this = this
    var id = _this.data.addressInfo.id
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              console.log('success')
            },
            fail () {
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
          if (_this.data.hasAddress) {
            // 有地址 则调用修改接口
            wx.chooseAddress({
              success: (res) => {
                console.log(res.userName)
                console.log(res.postalCode)
                console.log(res.provinceName)
                console.log(res.cityName)
                console.log(res.countyName)
                console.log(res.detailInfo)
                console.log(res.nationalCode)
                console.log(res.telNumber)
                _this.setData({
                  addressInfo: res,
                  hasAddress: true
                })
                console.log(_this.data.addressInfo)
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
                    id: id
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
                      //   ['addressInfo.id']: id
                      // })
                    } else if (res.data.status == 801) {
                      // this.getUserInfoFun(this.addAddress)
                      utils.getUserInfoFun(this.addAddress, this)
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              },
            })
          } else {
            wx.chooseAddress({
              success: (res) => {
                console.log(res.userName)
                console.log(res.postalCode)
                console.log(res.provinceName)
                console.log(res.cityName)
                console.log(res.countyName)
                console.log(res.detailInfo)
                console.log(res.nationalCode)
                console.log(res.telNumber)
                _this.setData({
                  addressInfo: res,
                  hasAddress: true
                })
                console.log(_this.data.addressInfo)
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
                        ['addressInfo.id']: id
                      })
                    } else if (res.data.status == 801) {
                      // this.getUserInfoFun(this.addAddress)
                      utils.getUserInfoFun(this.addAddress, this)
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              },
            })
          }  
        }
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isLoading: false
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        console.log(res.data)
        this.setData({
          token: res.data
        })
        this.getOrder()
      },
      fail: (res) => {
        // this.getUserInfoFun(this.getOrder)
        utils.getUserInfoFun(this.getOrder, this)
      }
    })
  },
  /**
   * 红包开关切换
   */
  switchChange: function (e) {
    console.log(e.detail.value)
    if (e.detail.value == true) {
      this.setData({
        isOpen: 1
      })
      this.getOrder()
    } else {
      this.setData({
        isOpen: 0
      })
      this.getOrder()
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isShowExit: true
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 获取确认订单商品列表
   */
  getOrder: function () {
    wx.request({
      url: config.config.postOrder,
      method: 'POST',
      dataType: 'json',
      data: {
        token: this.data.token,
        isCart: this.data.isCart,
        isOpen: this.data.isOpen
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data.bean)
          var ordersPay = res.data.bean.ordersPay
          var itemList = res.data.bean.itemList
          if (itemList.length == 0) {
            wx.navigateBack({
              delta: 1
            })
            return
          }
          var addressInfo = res.data.bean.address
          var reduceCoupon = res.data.bean.reduceCoupon
          var reducePrice = res.data.bean.reducePrice
          itemList.sort(utils.compareDown("updated"))
          this.setData({
            itemList: itemList,
            ordersPay: ordersPay,
            addressInfo: addressInfo,
            reduceCoupon: reduceCoupon,
            reducePrice: reducePrice,
            productPrice: res.data.bean.productPrice,
            deduction: res.data.bean.deduction,
            userAccounts: res.data.bean.userAccounts
          })
          console.log(this.data.addressInfo.id)
          if (addressInfo != "") {
            this.setData({
              hasAddress: true
            })
          }
          var param = {}
          var isSeaAmoy = false
          for (var i in itemList) {
              param.propName = JSON.parse(itemList[i].productParamText).propName
              param.price = JSON.parse(itemList[i].productParamText).price
              // 设置解析后的属性的值
              this.setData({
                ['itemList[' + i + '].productParamText']: param
              })
              if (itemList[i].isSeaAmoy == 1) {
                isSeaAmoy = true
              }
          }
          this.setData({
            isSeaAmoy: isSeaAmoy
          })
          this.setData({
            isLoading: true
          })
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.getOrder)
          utils.getUserInfoFun(this.getOrder, this)  
          this.setData({
            isLoading: true
          })                      
        } else if (res.data.status == 503) {
          wx.navigateBack({
            delta: 1
          })
          this.setData({
            isLoading: true
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          this.setData({
            isLoading: true
          })
        }
      }
    })
  },
  /**
   * 修改商品数量方法
   */
  modifyNumber: function (token, id, num) {
    wx.request({
      url: config.config.postNumber,
      data: {
        token: token,
        id: id,
        num: num
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // console.log(res.data)
          var ordersPay = res.data.bean.ordersPay
          this.setData({
            ordersPay: ordersPay,
            reduceCoupon: res.data.bean.reduceCoupon,
            reducePrice: res.data.bean.reducePrice,
            productPrice: res.data.bean.productPrice
          })
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.modifyNumber)
          utils.getUserInfoFun(this.modifyNumber, this)                                  
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
   * 减商品数量
   */
  reduceNumber: function (e) {
    if (this.data.isSeckill != 1) {
      var index = e.currentTarget.dataset.index
      if (this.data.itemList[index].num != 1) {
        this.data.itemList[index].num--
      }
      this.setData({
        itemList: this.data.itemList
      })
      var id = this.data.itemList[index].id
      var num = this.data.itemList[index].num
      var token = this.data.token
      // 修改数量接口
      this.modifyNumber(token, id, num)
    }
  },
  /**
   * 加商品数量
   */
  addNumber: function (e) {
    if (this.data.isSeckill != 1) {
      var index = e.currentTarget.dataset.index
      this.data.itemList[index].num++
      this.setData({
        itemList: this.data.itemList
      })
      var id = this.data.itemList[index].id
      var num = this.data.itemList[index].num
      var token = this.data.token
      // 修改数量接口
      this.modifyNumber(token, id, num)
    }
  },
  /**
   * 手动修改商品数量
   */
  bindkeyInput: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      ['itemList[' + index + '].num']: e.detail.value
    })
  },
  /**
   * 输入框失去焦点
   */
  bindkeyBlur: function (e) {
    var index = e.currentTarget.dataset.index
    if (e.detail.value == '') {
      this.setData({
        ['itemList[' + index + '].num']: 1
      })
      var id = this.data.itemList[index].id
      var num = this.data.itemList[index].num
      var token = this.data.token
      this.modifyNumber(token, id, num)
    }
  },
  // 获取备注输入内容
  bindInput: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  bindIdcardInput: function (e) {
    this.setData({
      idcardNumber: e.detail.value
    })
  },
  /**
   * 提交订单
   */
  wxPay: function () {
    if (this.data.canClickPayBtn) {
      if (this.data.addressInfo == null || this.data.addressInfo == '') {
        wx.showToast({
          title: '请填写地址信息',
          icon: 'none',
          duration: 2000
        })
      } else if (this.data.isSeaAmoy == true) {
        if (this.data.idcardNumber == '') {
          wx.showToast({
            title: '请输入您的身份证号',
            icon: 'none',
            duration: 2000
          })
        } else {
          var regName = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
          if (!regName.test(this.data.idcardNumber)) {
            wx.showToast({
              title: '身份证格式有误',
              icon: 'none',
              duration: 2000
            })
          } else {
            this.setData({
              canClickPayBtn: false
            })
            this.payOrder()
          }
        }
      } else {
        this.setData({
          canClickPayBtn: false
        })
        this.payOrder()
      }
    }
  },
  /**
   * 关闭支付
   */
  closeWallet: function () {
    this.setData({
      isShowWallet: false,
      canClickPayBtn: true
    })
  },
  /**
   * 点击确认使用钱包支付
   */
  confirmPayWallet: function () {
    var _this = this
    if (this.data.remarks == '') {
      this.setData({
        remarks: '无备注'
      })
    }
    wx.request({
      url: config.config.postOrderSubmit,
      data: {
        token: this.data.token,
        remarks: this.data.remarks,
        addressId: this.data.addressInfo.id,
        priceTotal: this.data.ordersPay,
        deduction: this.data.deduction
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean.CODE == 'success') {
            wx.reLaunch({
              url: '/pages/payResult/payResult',
            })
          } else {
            wx.requestPayment({
              'timeStamp': res.data.bean.timeStamp,
              'nonceStr': res.data.bean.nonceStr,
              'package': res.data.bean.package,
              'signType': 'MD5',
              'paySign': res.data.bean.sign,
              'success': function (res) {
                console.log(res)
                wx.reLaunch({
                  url: '/pages/payResult/payResult',
                })
                _this.setData({
                  canClickPayBtn: true
                })
              },
              'fail': function (res) {
                wx.navigateTo({
                  url: '/pages/order/order?currentNavtab=1',
                })
                _this.setData({
                  canClickPayBtn: true
                })
              }
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.confirmPayWallet, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          _this.setData({
            canClickPayBtn: true
          })
        }
      }
    })

  },
  //订单支付
  payOrder: function () {
    if (this.data.ordersPay == '0.00') {
      this.setData({
        isShowWallet: true
      })
    } else {
      console.log(222)
      var _this = this    
      if (this.data.remarks == '') {
        this.setData({
          remarks: '无备注'
        })
      }
      if (this.data.canClick) {
        wx.request({
          url: config.config.postOrderSubmit,
          data: {
            token: this.data.token,
            remarks: this.data.remarks,
            addressId: this.data.addressInfo.id,
            priceTotal: this.data.ordersPay,
            deduction: this.data.deduction
          },
          dataType: 'json',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            if (res.data.status == 200) {
              if (res.data.bean.CODE == 'success') {
                wx.reLaunch({
                  url: '/pages/payResult/payResult',
                })
              } else {
                wx.requestPayment({
                  'timeStamp': res.data.bean.timeStamp,
                  'nonceStr': res.data.bean.nonceStr,
                  'package': res.data.bean.package,
                  'signType': 'MD5',
                  'paySign': res.data.bean.sign,
                  'success': function (res) {
                    console.log(res)
                    wx.reLaunch({
                      url: '/pages/payResult/payResult',
                    })
                    _this.setData({
                      canClickPayBtn: true
                    })
                  },
                  'fail': function (res) {
                    wx.navigateTo({
                      url: '/pages/order/order?currentNavtab=1',
                    })
                    _this.setData({
                      canClickPayBtn: true
                    })
                  }
                })
              }            
            } else if (res.data.status == 801) {
              // this.getUserInfoFun(this.payOrder)
              utils.getUserInfoFun(this.payOrder, this)                                              
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              _this.setData({
                canClickPayBtn: true
              })
            }
          }
        })
      }
    }
  },
  gotoCoupon: function () {
    if (this.data.isSeckill != 1) {
      wx.navigateTo({
        url: '/pages/couponList/couponList?totalPrice=' + this.data.productPrice,
      })
    }
  }
})
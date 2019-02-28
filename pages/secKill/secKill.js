// pages/productDetails/productDetails.js
const app = getApp()
var config = require('../../utils/config.js')
var common = require('../../utils/commonRequest.js');
const utils = require('../../utils/util.js')
Page({
  data: {
    bannerImgList: [],
    detailsImgList: [],
    isShowDialog: false,
    styletext: 'bottom:-70%;',
    isCollect: false,
    isShowModal: false,
    indicatorDots: true,
    id: '',
    autoplay: false,
    interval: 5000,
    duration: 500,
    productInfo: {},
    information: [],
    skuList: [],
    skuPrice: '',
    skuImg: '',
    styletxt: '',
    buyNumber: 1,
    selectedProp: {},
    sku: '',
    flag: '',
    serves: []
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  /**
   * 属性面板显示切换
   */
  toggleDialog: function () {
    this.setData({
      isShowDialog: !this.data.isShowDialog
    })
    if (this.data.isShowDialog) {
      if (this.data.iphonex) {
        this.setData({
          styletext: 'bottom:60rpx;',
          isPop: true
        })
      } else {
        this.setData({
          styletext: 'bottom:0;',
          isPop: true
        })
      }
    } else {
      this.setData({
        styletext: 'bottom:-70%;',
        isPop: false
      })
    }
  },
  toggleModal: function () {
    this.setData({
      isShowModal: !this.data.isShowModal
    })
  },
  /**
   * 立即购买按钮触发
   */
  buyNow: function () {
    if (this.data.buyQualification != 2) {
      if (this.data.isLogin != true) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      } else {
        if (this.data.buyQualification == 0) {
          if (this.data.sku == '' || this.data.selectedProp == '') {
            // 弹出属性选择框
            this.toggleDialog()
            this.setData({
              flag: 'buyNow'
            })
          } else {
            this.getUserPhone()
          }
        } else if (this.data.buyQualification == 1) {
          wx.showToast({
            title: '您已买过此商品，逛逛其他吧',
            icon: 'none'
          })
        }
      }
    }
  },
  /**
   * 立即购买表单提交
   */
  buyNowFun: function () {
    wx.request({
      url: config.config.postBuyNow,
      data: {
        token: this.data.token,
        productId: this.data.id,
        title: this.data.productInfo.title,
        basePrice: this.data.skuPrice,
        param: JSON.stringify(this.data.selectedProp),
        pictureCover: this.data.skuImg,
        num: this.data.buyNumber,
        sku: this.data.sku,
        isSeaAmoy: this.data.productInfo.isSeaAmoy,
        beforePrice: this.data.productInfo.beforePrice
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.navigateTo({
            url: '/pages/confirmOrder/confirmOrder?isCart=2&isSeckill=1'
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.buyNowFun, this)
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
   * 检测用户手机号
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
          app.globalData.userPhone = res.data.bean
          this.setData({
            userPhone: res.data.bean,
            hasUserPhone: true
          })
          // 已经绑定则调用立即购买
          this.buyNowFun()
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getUserPhone, this)
        } else {
          app.globalData.userPhone = ''
          wx.navigateTo({
            url: '/pages/bindPhone/bindPhone',
          })
          this.setData({
            hasUserPhone: false
          })
        }
      },
    })
  },
  /**
   * 查看购物车页面
   */
  gotoCar: function () {
    wx.navigateTo({
      url: '/pages/shoppingCar/shoppingCar',
    })
  },
  /**
   * 跳转首页
   */
  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  /**
   * 生命周期函数--监听页面显示 
   * 获取登录状态isLogin
   * 获取token
   */
  onShow: function () {
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
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        this.getProductInfo()
        this.getCarNumber()
      },
      fail: (res) => {
        this.setData({
          token: app.globalData.token
        })
        this.getProductInfo()
      }
    })
    wx.showNavigationBarLoading()
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.toLowerCase().indexOf('iphone x') > -1) {
          console.log('xx')
          this.setData({
            iphonex: true
          })
        }
      },
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getProductInfo()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.productInfo.title,
      path: '/pages/secKill/secKill?id=' + this.data.id,
    }
  },
  /**
   * 获取产品详细信息
   */
  getProductInfo: function () {
    wx.request({
      url: config.config.getSeckillProductInfo,
      data: {
        token: this.data.token,
        productId: this.data.id
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading()
          var productInfo = res.data.bean.product
          var bannerImgList = res.data.bean.product.pictureBanner.split(",")
          var detailsImgList = res.data.bean.product.details.split(",")
          var information = JSON.parse(res.data.bean.product.information)
          var timeLeft = res.data.bean.timeLeft
          // buyQualification - 1: 售罄，0: 可购买, 1: 已购买，2: 秒杀活动结束
          var buyQualification = res.data.bean.buyQualification
          if (res.data.bean.product.serves) {
            var serves = JSON.parse(res.data.bean.product.serves)
          } else {
            var serves = []
          }
          var skuList = JSON.parse(res.data.bean.product.skuList)
          if (skuList.length > 0) {
            var min = -1
            for (var i in skuList) {
              if (skuList[i].stock > 0) {
                min = i;
                break;
              }
            }
            if (min > -1) {
              var skuPrice = skuList[min].price
              var skuImg = skuList[min].skuImg || productInfo.pictureCover
              skuList[min].isSelect = true
            } else {
              var skuPrice = skuList[0].price
              var skuImg = skuList[0].skuImg || productInfo.pictureCover
            }
          } else {
            var skuPrice = ''
            var skuImg = ''
          }
          this.setData({
            seckillLefttime: timeLeft,
            productInfo: productInfo,
            bannerImgList: bannerImgList,
            detailsImgList: detailsImgList,
            information: information,
            skuList: skuList,
            serves: serves,
            skuPrice: skuPrice,
            skuImg: skuImg,
            buyQualification: buyQualification,
          })
          if (this.data.seckillLefttime > 0) {
            var days = Math.floor(this.data.seckillLefttime / 60 / 60 / 24)
            var hours = this.addNumberZero(Math.floor(this.data.seckillLefttime / 60 / 60 % 24));
            var minutes = this.addNumberZero(Math.floor(this.data.seckillLefttime / 60 % 60));
            var seconds = this.addNumberZero(Math.floor(this.data.seckillLefttime % 60));
            this.setData({
              killdays: days,
              killhours: hours,
              killminutes: minutes,
              killseconds: seconds
            })
            // 开始倒计时
            this.countDownKill()
          } else {
            this.setData({
              killdays: 0,
              killhours: '00',
              killminutes: '00',
              killseconds: '00'
            })
          } 
        } else if (res.data.status == 501) {
          wx.reLaunch({
            url: '/pages/errorPage/errorPage',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getProductInfo, this)
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
  /**
   * 倒计时
   */
  countDownKill: function () {
    clearInterval(this.data.timerkill)
    this.data.timerkill = setInterval(() => {
      if (this.data.seckillLefttime > 0) {
        this.data.seckillLefttime--
        var days = Math.floor(this.data.seckillLefttime / 60 / 60 / 24)
        var hours = this.addNumberZero(Math.floor(this.data.seckillLefttime / 60 / 60 % 24));
        var minutes = this.addNumberZero(Math.floor(this.data.seckillLefttime / 60 % 60));
        var seconds = this.addNumberZero(Math.floor(this.data.seckillLefttime % 60));
        this.setData({
          killdays: days,
          killhours: hours,
          killminutes: minutes,
          killseconds: seconds
        })
      } else {
        this.setData({
          buyQualification: 2
        })
      }
    }, 1000)
  },
  addNumberZero: function (num) {
    var num = (num > 9) ? num : ('0' + num);
    return num;
  },
  /**
   * 选择商品属性
   */
  selectSku: function (e) {
    // console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var skuPrice = this.data.skuList[index].price
    var stock = this.data.skuList[index].stock
    var skuImg = this.data.skuList[index].skuImg || this.data.productInfo.pictureCover
    if (stock > 0) {
      for (var i in this.data.skuList) {
        this.data.skuList[i].isSelect = false
      }
      this.data.skuList[index].isSelect = true
      this.setData({
        skuPrice: skuPrice,
        skuImg: skuImg,
        skuList: this.data.skuList
      })
    }
  },
  /**
   * 获取选择的SKU信息
   */
  getSelectSku: function () {
    // 去掉noscroll
    this.setData({
      isPop: false
    })
    var selectedProp = {}
    var sku = ''
    for (var i in this.data.skuList) {
      if (this.data.skuList[i].isSelect == true) {
        selectedProp.propName = this.data.skuList[i].major
        selectedProp.price = this.data.skuList[i].price
        selectedProp.skuImg = this.data.skuList[i].skuImg
        sku = this.data.skuList[i].sku
      }
    }
    this.setData({
      sku: sku,
      selectedProp: selectedProp,
      isShowDialog: !this.data.isShowDialog
    })
    if (this.data.flag == 'car') {
      // 如果点击加入购物车过来的 则选完之后执行加入购物车操作
      // this.submitCar()
    } else if (this.data.flag == 'buyNow') {
      // 如果点击立即购买过来的 则选完之后执行购买操作
      if (this.data.buyQualification == 0) {
        this.getUserPhone()
      } else if (this.data.buyQualification == 1) {
        wx.showToast({
          title: '您已买过此商品，逛逛其他吧',
          icon: 'none'
        })
      } else if (this.data.buyQualification == 2) {
        wx.showToast({
          title: '活动已结束',
          icon: 'none'
        })
      }
    }
  },
  /**
   * 减数量
   */
  reduceNumber: function () {
    if (this.data.buyNumber != 1) {
      this.data.buyNumber--
    }
    this.setData({
      buyNumber: this.data.buyNumber
    })
  },
  /**
   * 加数量
   */
  addNumber: function () {
    this.data.buyNumber++
    this.setData({
      buyNumber: this.data.buyNumber
    })
  },
  /**
   * 手动输入数量
   */
  bindKeyInput: function (e) {
    if (e.detail.value != '' && e.detail.value < 100) {
      this.setData({
        buyNumber: parseInt(e.detail.value)
      })
    }
  },
  bindkeyBlur: function (e) {
    if (e.detail.value == '') {
      this.setData({
        buyNumber: 1
      })
    }
    if (e.detail.value > 99) {
      this.setData({
        buyNumber: 99
      })
    }
    if (e.detail.value == 0) {
      this.setData({
        buyNumber: 1
      })
    }
  },
  /** 
   * 获取购物车商品数量
  */
  getCarNumber: function () {
    if (this.data.token != 'paixi_123') {
      wx.request({
        url: config.config.getShoppingCarNumber,
        data: {
          token: this.data.token
        },
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            console.log(res.data.bean)
            this.setData({
              carNumber: res.data.bean
            })
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.getCarNumber, this)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }
  }
})
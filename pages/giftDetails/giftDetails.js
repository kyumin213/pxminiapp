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
  hasCollected: function () {
    wx.request({
      url: config.config.postHasCollected,
      method: 'POST',
      data: {
        token: this.data.token,
        productId: this.data.id
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean == 1) {
            this.setData({
              isCollect: true
            })
          } else if (res.data.bean == 2) {
            this.setData({
              isCollect: false
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.hasCollected, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
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
  /**
   * 收藏切换
   */
  toggleCollect: function () {
    if (this.data.isLogin) {
      if (!this.data.isCollect) {
        wx.request({
          url: config.config.postAddCollect,
          method: 'POST',
          data: {
            token: this.data.token,
            productId: this.data.id
          },
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            if (res.data.status == 200) {
              console.log(res.data.bean)
              utils.showTips('添加收藏成功')
              this.setData({
                isCollect: !this.data.isCollect
              })
            } else if (res.data.status == 801) {
              utils.getUserInfoFun(this.toggleCollect, this)
            } else {
              utils.showTips(res.data.msg)
            }
          }
        })
      } else {
        wx.request({
          url: config.config.postRemoveCollect,
          method: 'POST',
          data: {
            token: this.data.token,
            id: this.data.id
          },
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            if (res.data.status == 200) {
              utils.showTips('您已取消收藏')
              this.setData({
                isCollect: !this.data.isCollect
              })
            } else if (res.data.status == 801) {
              utils.getUserInfoFun(this.toggleCollect, this)
            } else {
              utils.showTips(res.data.msg)
            }
          }
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  toggleModal: function () {
    this.setData({
      isShowModal: !this.data.isShowModal
    })
  },
  /**
   * 送给好友
   */
  addGift: function () {
    if (this.data.isLogin != true) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      if (this.data.sku == '' || this.data.selectedProp == '') {
        // 弹出属性选择框 postAddGift
        this.toggleDialog()
        this.setData({
          flag: 'car'
        })
      } else {
        this.submitAddGift()
      }
    }
    // if (this.data.sku == '' || this.data.selectedProp == '') {
    //   // 弹出属性选择框 postAddGift
    //   this.toggleDialog()
    //   this.setData({
    //     flag: 'car'
    //   })
    // } else {
    //   if (this.data.isLogin != true) {
    //     this.getUserInfoFun(this.submitAddGift)
    //   } else {
    //     console.log('submitAddGift')
    //     this.submitAddGift()
    //   }
    // }
  },
  // 提交添加礼物
  submitAddGift: function () {
    console.log(config.config.postAddGift)    
    wx.request({
      url: config.config.postAddGift,
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
          wx.reLaunch({
            url: '/pages/gifts/gifts',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitAddGift, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 加入购物车
   */
  addCar: function () {
    // Todo 加入购物车要验证是否登陆
    if (this.data.sku == '' || this.data.selectedProp == '') {
      // 弹出属性选择框
      this.toggleDialog()
      this.setData({
        flag: 'car'
      })
    } else {
      if (this.data.isLogin != true) {
        utils.getUserInfoFun(this.submitCar, this)
      } else {
        this.submitCar()
      }
    }
  },
  // 提交购物车
  submitCar: function () {
    wx.request({
      url: config.config.postCar,
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
          // 购物车数量增加 请求获取数量
          this.getCarNumber()
          utils.showTips('添加成功')
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitCar, this)
        } else {
          utils.showTips(res.data.msg)
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
      url: '/pages/shoppingCarInner/shoppingCarInner',
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
        this.hasCollected()
        this.getCarNumber()
      },
      fail: (res) => {
        this.setData({
          token: app.globalData.token
        })
        this.getProductInfo()
        // this.getUserInfoFun(this.getProductInfo)
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.productInfo.title,
      path: '/pages/productDetails/productDetails?id=' + this.data.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 获取产品详细信息
   */
  getProductInfo: function () {
    wx.request({
      url: config.config.getProductDetails,
      data: {
        token: this.data.token,
        id: this.data.id
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading()
          var productInfo = res.data.bean
          var bannerImgList = res.data.bean.pictureBanner.split(",")
          var detailsImgList = res.data.bean.details.split(",")
          var information = JSON.parse(res.data.bean.information)
          var serves = JSON.parse(res.data.bean.serves)
          var skuList = JSON.parse(res.data.bean.skuList)
          if (skuList.length > 0) {
            var skuPrice = skuList[0].price
            var skuImg = skuList[0].skuImg || productInfo.pictureCover
            skuList[0].isSelect = true
          } else {
            var skuPrice = ''
            var skuImg = ''
          }
          this.setData({
            productInfo: productInfo,
            bannerImgList: bannerImgList,
            detailsImgList: detailsImgList,
            information: information,
            skuList: skuList,
            serves: serves,
            skuPrice: skuPrice,
            skuImg: skuImg
          })
          console.log(this.data.skuList)
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getProductInfo, this)
        } else if (res.data.status == 501) {
          wx.navigateTo({
            url: '/pages/errorPage/errorPage',
          })
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 选择商品属性
   */
  selectSku: function (e) {
    // console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var skuPrice = this.data.skuList[index].price
    var skuImg = this.data.skuList[index].skuImg || this.data.productInfo.pictureCover
    for (var i in this.data.skuList) {
      this.data.skuList[i].isSelect = false
    }
    this.data.skuList[index].isSelect = true
    this.setData({
      skuPrice: skuPrice,
      skuImg: skuImg,
      skuList: this.data.skuList
    })
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
    if (e.detail.value == '' ) {
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
      this.submitAddGift()
      // if (this.data.isLogin != true) {
      //   // this.getUserInfoFun(1)
      //   this.getUserInfoFun(this.submitAddGift)
      // } else {
      //   this.submitAddGift()
      // }
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
            utils.showTips(res.data.msg)
          }
        }
      })
    }
  }
})
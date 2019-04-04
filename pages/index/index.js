//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
// var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    toView: 'red',
    scrollTop: 100,
    recommendTitle: '',
    weekendBanner: "",
    topics: [],
    recommendProduct: [],
    weekend: '',
    timer: null,
    goodsNumber: '',
    trans: 20,
    autoplay: false,
    interval: 5000,
    duration: 500,
    isNew: true,
    hasCoupon: true,
    showSeckill: false,
    isEnd: false,
    isShowWeek: true,
    canClick: true
  },
  gotoresult: function () {
    wx.navigateTo({
      url: '/pages/activityResult/activityResult?ordersId=154054535769390',
    })
  },
  /**
   * 去许愿树
   */
  gotoWishing: function () {
    if (this.data.isLogin) {
      if (this.data.canClick) {
        this.getUserStatus()
      }
    } else {
      // 未登录直接进入选取愿望页面
      wx.navigateTo({
        url: '/packageA/pages/wishing/wishing',
      })
    }    
  },
  /**
   * 判断用户种树状态 0：全新玩家；1：没有许愿树；2：有许愿树；3：有成熟的果实;4：已摘取；5：已脱落；
   */
  getUserStatus: function () {
    this.setData({
      canClick: false
    })
    utils.httpRequestGet(config.config.getWishTreeStatus, { token: this.data.token }, (res) => {
      this.setData({
        canClick: true
      })
      if (res.data.status == 200) {
        if (res.data.bean == 0) {
          wx.navigateTo({
            url: '/packageA/pages/wishing/wishing?isNew=' + true,
          })
        } else if (res.data.bean == 1 || res.data.bean == 4) {
          wx.navigateTo({
            url: '/packageA/pages/wishing/wishing',
          })
        } else if (res.data.bean == 2 || res.data.bean == 3 || res.data.bean == 5) {
          wx.navigateTo({
            url: '/packageA/pages/wishTree/wishTree',
            // url: '/packageA/pages/watering/watering'
          })
        }
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getUserStatus, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 去活动页面 
   */
  gotoActivity: function () {
      wx.reLaunch({
        url: '/pages/activityList/activityList',
      })
  },
  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  gotoGift: function () {
    wx.reLaunch({
      url: '/pages/gifts/gifts',
    })
  },
  gotoCar: function () {
    wx.navigateTo({
      url: '/pages/shoppingCar/shoppingCar',
    })
  },
  gotoUser: function () {
    wx.navigateTo({
      url: '/pages/me/me',
    })
  },
  gotoDetails: function () {
    wx.navigateTo({
      url: '/pages/konwAbout/konwAbout',
    })
  },
  imgLoadComplete: function () {
    this.setData({
      imgLoading: true
    })
    wx.hideLoading()
  },
  weekendLoadComplete: function () {
    this.setData({
      weekendLoading: true
    })
  },
  secKillLoadComplete: function () {
    this.setData({
      secKillLoading: true
    })
  },
  // 视频
  playVideo: function () {
    this.setData({
      isShowVideo: true
    })
  },
  closeVideo: function () {
    this.setData({
      isShowVideo: false
    })
  },
  onLoad: function () {
    this.getSharePic('index') 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getIndexData()
    this.getHotProduct()
  },
  onShow: function () {
    var isLogin = wx.getStorageSync("isLogin") || false
    this.setData({
      isLogin: isLogin,
      token: 'paixi_123'
    })    
    this.getIndexData()
    this.getCouponList()
    this.getHotProduct()
    this.getSeconds()
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        // 有token可以获取购物车商品数量
        this.getGoodsNum()      
      },
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth
        })
      }
    })
  },
  onHide: function () {
    clearInterval(this.data.timer)
    clearInterval(this.data.timerkill)
  },
  onUnload: function () {
    clearInterval(this.data.timer)
    clearInterval(this.data.timerkill)
  },
  /**
   * 获取首页热销商品
   */
  getHotProduct: function () {
    utils.httpRequestGet(config.config.getHotProduct, {token: this.data.token}, (res) => {
      if (res.data.status == 200) {
        this.setData({
          hotList: res.data.bean || []
        })
      } else if (res.data.status != 801){
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 去热销专题
   */
  gotoHotSpecial: function () {
    var id = this.data.sellRecommend.id
    var title = this.data.sellRecommend.name
    var specialBanner = this.data.sellRecommend.pictureBanner
    wx.navigateTo({
      url: '/pages/special/special?id=' + id + '&title=' + title + '&specialBanner=' + specialBanner,
    })
  },
  /**
   * 去热销推荐产品详情
   */
  gotoProductDetails: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' + id,
    })
  },
  /**
   * 获取购物车商品数量
   */
  getGoodsNum: function () {
    if (this.data.isLogin) {
      utils.httpRequestGet(config.config.getShoppingCarNumber, { token: this.data.token }, (res) => {
        if (res.data.status == 200) {
          if (res.data.bean != 0) {
            this.setData({
              goodsNumber: res.data.bean
            })
          } else {
            this.setData({
              goodsNumber: ''
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getGoodsNum, this)
        } else {
          utils.showTips(res.data.msg)
        }
      })
    }
  },
  /**
   * 获取倒计时剩余秒数
   */
  getSeconds: function () {
    utils.httpRequestGet(config.config.getCountSeconds, { token: this.data.token }, (res) => {
      if (res.data.status == 200) {
        this.setData({
          leftTime: res.data.bean,
          showTime: true
        })
        var days = Math.floor(this.data.leftTime / 60 / 60 / 24)
        var hours = this.addNumber(Math.floor(this.data.leftTime / 60 / 60 % 24));
        var minutes = this.addNumber(Math.floor(this.data.leftTime / 60 % 60));
        var seconds = this.addNumber(Math.floor(this.data.leftTime % 60));
        this.setData({
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds
        })
        // 开始倒计时
        this.countDown()
      }
    })
  },
  /**
   * 倒计时
   */
  countDown: function () {
    clearInterval(this.data.timer)
    this.data.timer = setInterval(() => {
      this.data.leftTime--
      var days = Math.floor(this.data.leftTime / 60 / 60 / 24)
      var hours = this.addNumber(Math.floor(this.data.leftTime / 60 / 60 % 24));
      var minutes = this.addNumber(Math.floor(this.data.leftTime / 60 % 60));
      var seconds = this.addNumber(Math.floor(this.data.leftTime % 60));
      this.setData({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      })
    }, 1000)
  },
  countDownKill: function () {
    clearInterval(this.data.timerkill)
    this.data.timerkill = setInterval(() => {
      if (this.data.seckillLefttime > 0) {
        this.data.seckillLefttime--
        var days = Math.floor(this.data.seckillLefttime / 60 / 60 / 24)
        var hours = this.addNumber(Math.floor(this.data.seckillLefttime / 60 / 60 % 24));
        var minutes = this.addNumber(Math.floor(this.data.seckillLefttime / 60 % 60));
        var seconds = this.addNumber(Math.floor(this.data.seckillLefttime % 60));
        this.setData({
          killdays: days,
          killhours: hours,
          killminutes: minutes,
          killseconds: seconds,
        })
      } else {
        this.setData({
          // showSeckill: false,
          isEnd: true
        })
      }       
    }, 1000)
  },
  addNumber: function (num) {
    var num = (num > 9) ? num : ('0' + num);
    return num;
  },
  /**
   * 获取首页数据
   */
  getIndexData: function () {
    wx.showNavigationBarLoading()
    utils.httpRequestGet(config.config.getIndexNew, { token: this.data.token }, (res) => {
      if (res.data.status == 200) {
        var topics = res.data.bean.specials || []
        var sellRecommend = res.data.bean.sellRecommend || null
        var weekend = {}
        var specialsWeekId = ''
        if (res.data.bean.specialsWeek) {
          weekend = res.data.bean.specialsWeek
          specialsWeekId = res.data.bean.specialsWeek.id
        } else {
          this.setData({
            isShowWeek: false
          })
        }
        var specialTimeLimit = {}
        var seckillLefttime = ''
        if (res.data.bean.specialTimeLimit) {
          specialTimeLimit = res.data.bean.specialTimeLimit.special || []
          seckillLefttime = res.data.bean.specialTimeLimit.timeLeft
          this.setData({
            showSeckill: true
          })
        }
        // console.log(this.data.showSeckill)
        wx.setStorage({
          key: 'specialsWeekId',
          data: specialsWeekId,
        })
        this.setData({
          topics: topics,
          weekend: weekend,
          sellRecommend: sellRecommend,
          specialTimeLimit: specialTimeLimit
        })
        var name = []
        for (var i in topics) {
          name = topics[i].name.split('+')
          this.setData({
            ['topics[' + i + '].name']: name
          })
        }
        wx.hideLoading()
        setTimeout(() => {
          this.setData({
            showIndex: true
          })
        }, 500)
        //秒杀倒计时
        // this.setData({
        //   seckillLefttime: seckillLefttime
        // })
        // if (this.data.seckillLefttime > 0) {
        //   var days = Math.floor(this.data.seckillLefttime / 60 / 60 / 24)
        //   var hours = this.addNumber(Math.floor(this.data.seckillLefttime / 60 / 60 % 24));
        //   var minutes = this.addNumber(Math.floor(this.data.seckillLefttime / 60 % 60));
        //   var seconds = this.addNumber(Math.floor(this.data.seckillLefttime % 60));
        //   this.setData({
        //     killdays: days,
        //     killhours: hours,
        //     killminutes: minutes,
        //     killseconds: seconds,
        //     isEnd: false
        //   })
        //   // 开始倒计时
        //   this.countDownKill()
        // } else {
        //   this.setData({
        //     killdays: 0,
        //     killhours: '00',
        //     killminutes: '00',
        //     killseconds: '00',
        //     isEnd: true
        //   })
        // }
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  closePop: function () {
    this.setData({
      hasCoupon: true
    })
  },
  gotoSpecial: function (e) {
    var index = e.currentTarget.dataset.index
    var id = this.data.topics[index].id
    var titleArr = this.data.topics[index].name
    if (titleArr.length > 1) {
      var title = titleArr[1]
    } else {
      var title = titleArr[0]
    }
    var specialBanner = this.data.topics[index].pictureBanner
    wx.navigateTo({
      url: '/pages/special/special?id=' + id + '&title=' + title + '&specialBanner=' + specialBanner,
    })
  },
  /**
   * 去秒杀专题
   */
  gotoSpecialSeckill: function (e) {
    var id = this.data.specialTimeLimit.id
    wx.navigateTo({
      url: '/pages/secKillList/secKillList?id=' + id,
    })
  },
  /**
   * 周周派喜专题
   */
  gotoSpecialsWeek: function () {
    var id = this.data.weekend.id
    var title = this.data.weekend.name
    var specialBanner = this.data.weekend.pictureBanner
    wx.navigateTo({
      url: '/pages/special/special?id=' + id + '&title=' + title + '&specialBanner=' + specialBanner,
    })
  },
  // 获取分享小图
  getSharePic: function (configKey) {
    utils.httpRequestGet(config.config.getSharePic, { configKey: configKey }, (res) => {
      if (res.data.status == 200) {
        // console.log(res.data.bean)
        this.setData({
          sharePic: res.data.bean.configValue,
          shareText: res.data.bean.description
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareText,
      imageUrl: this.data.sharePic
    }
  },
  /**
   * 获取优惠券
   */
  getCouponList: function () {
    utils.httpRequestGet(config.config.getCouponIndex, { token: this.data.token }, (res) => {
      if (res.data.status == 200) {
        if (res.data.bean) {
          var couponList = res.data.bean
          var couponArr = []
          for (var i in couponList) {
            couponArr.push(couponList[i].id)
          }
          this.setData({
            couponArr: couponArr
          })
          console.log(couponArr)
          console.log(couponArr.toString())
          if (this.data.token != 'paixi_123' && this.data.token) {
            // 判断是否领取过优惠券
            this.userHasCoupon()
          } else {
            this.setData({
              hasCoupon: false
            })
          }
        }
      } else {
        this.setData({
          hasCoupon: true
        })
      }
    })
  },
  /**
   * 领取优惠券
   */
  getCoupon: function () {
    if (this.data.isLogin) {
      utils.httpRequestPost(config.config.postAddCoupon, { token: this.data.token, couponIds: this.data.couponArr}, 
      (res) => {
        if (res.data.status == 200) {
          this.setData({
            hasCoupon: true
          })
          utils.showTips('领取成功!')
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getCoupon, this)
        } else {
          utils.showTips(res.data.msg)
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 查询用户是否领取了优惠券
   */
  userHasCoupon: function () {
    utils.httpRequestPost(config.config.postHasCoupon, { token: this.data.token, couponIds: this.data.couponArr },
      (res) => {
        if (res.data.status == 200) {
          var hasCoupon = res.data.bean == 0 ? false : true
          this.setData({
            hasCoupon: hasCoupon
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.userHasCoupon, this)
        } else {
          utils.showTips(res.data.msg)
        }
    })
  }
})

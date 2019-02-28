// pages/activityList/activityList.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressWay: ["", "", "", "", "", "吐槽有奖", "拼图有奖","答题有奖","","摇骰有奖"],
    goodsNumber: '',
    showSeckill: false,
    canClick: true
  },
  // 获取分享小图
  getSharePic: function () {
    wx.request({
      url: config.config.getSharePic,
      data: {
        configKey: 'shareList',
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            sharePic: res.data.bean.configValue,
            shareText: res.data.bean.description
          })
        } else {
          utils.showTips(res.data.msg)
        }
      }
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
    wx.request({
      url: config.config.getWishTreeStatus,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        this.setData({
          canClick: true
        })
        if (res.data.status == 200) {
          if (res.data.bean == 0) {
            wx.navigateTo({
              url: '/packageA/pages/wishing/wishing?isNew=true',
            })
          } else if (res.data.bean == 1 || res.data.bean == 4) {
            wx.navigateTo({
              url: '/packageA/pages/wishing/wishing',
            })
          } else if (res.data.bean == 2 || res.data.bean == 3|| res.data.bean == 5) {
            wx.navigateTo({
              url: '/packageA/pages/wishTree/wishTree',
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getUserStatus, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
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
  /**
   * 获取购物车商品数量
   */
  getGoodsNum: function () {
    if (this.data.isLogin) {
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
          }
        }
      })
    }
  },
  /**
   * 获取活动列表
   */
  getActivityList: function () {
      wx.request({
        url: config.config.getActivity,
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
            if (res.data.bean) {
              var activityList = res.data.bean
              this.setData({
                activityList: activityList,
              })
              var dateArr = []
              var timeArr = []
              for (var i in activityList) {
                var endTime = activityList[i].freeOrders.endTime.split(" ")
                dateArr = endTime[0].split('-')
                timeArr = endTime[1]
                this.setData({
                  ['activityList[' + i + '].dateArr']: dateArr,
                  ['activityList[' + i + '].timeArr']: timeArr
                })
              }
              // console.log(timeArr, dateArr)
              this.setData({
                isLoadingComplete: true
              })
            }
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.getActivityList, this)
          } else {
            utils.showTips(res.data.msg)
          }
        }
      })
  },
  // 获取下期活动开始时间
  getNextTime: function () {
    wx.request({
      url: config.config.getNextActivityTime,
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
            nextTime: res.data.bean
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getNextTime, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
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
  /**
   * 去详情页面
   */
  gotoActivity: function (e) {
    var index = e.currentTarget.dataset.index
    var addressWay = this.data.activityList[index].userMaker.addressWay
    var ordersId = this.data.activityList[index].freeOrders.id    
    if (addressWay == 5) {
      wx.navigateTo({
        url: '/pages/activity/activity?ordersId=' + ordersId,
      })
    } else if (addressWay == 6){
      wx.navigateTo({
        url: '/pages/activityPintu/activityPintu?ordersId=' + ordersId,
      })
    } else if (addressWay == 7) {
      wx.navigateTo({
        url: '/pages/activityAnswer/activityAnswer?ordersId=' + ordersId,
      })
    } else if (addressWay == 9) {
      wx.navigateTo({
        url: '/pages/activityDice/activityDice?ordersId=' + ordersId,
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
      }
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        this.getActivityList()
        this.getGoodsNum()
        this.getNextTime()
        this.getSeckill()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getActivityList()
        this.getSeckill()
      }
    })
    this.getSharePic()
  },
  /**
   * 获取当期秒杀专题
   */
  getSeckill: function () {
    wx.request({
      url: config.config.getCurrentSeckill,
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
            showSeckill: false
          })
          if (res.data.bean.special) {
            this.setData({
              seckillList: res.data.bean.special,
              seckillLefttime: res.data.bean.timeLeft,
              showSeckill: true
            })
          }
        } else if (res.data.status == 501) {
          this.setData({
            showSeckill: false
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getSeckill, this)
        } else {
          utils.showTips(res.data.msg)
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
        var hours = this.addNumber(Math.floor(this.data.seckillLefttime / 60 / 60 % 24));
        var minutes = this.addNumber(Math.floor(this.data.seckillLefttime / 60 % 60));
        var seconds = this.addNumber(Math.floor(this.data.seckillLefttime % 60));
        this.setData({
          killdays: days,
          killhours: hours,
          killminutes: minutes,
          killseconds: seconds
        })
      }
    }, 1000)
  },
  addNumber: function (num) {
    var num = (num > 9) ? num : ('0' + num);
    return num;
  },
  /**
   * 去秒杀专题
   */
  gotoSpecialSeckill: function (e) {
    var id = this.data.seckillList.id
    wx.navigateTo({
      url: '/pages/secKillList/secKillList?id=' + id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getActivityList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareText,
      path:'/pages/activityList/activityList',
      imageUrl: this.data.sharePic
    }
  }
})
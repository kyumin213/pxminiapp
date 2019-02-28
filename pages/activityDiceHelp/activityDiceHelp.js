// pages/diceGame/diceGame.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canClick: true,
    defaultPage: 1,
    userPartake: []
  },
  /**
   * 锚点定位至规则
   */
  scrollToRule: function () {
    wx.pageScrollTo({
      scrollTop: 2500,
      duration: 300
    })
  },
  // 获取分享小图
  getSharePic: function (configKey) {
    wx.request({
      url: config.config.getSharePic,
      data: {
        configKey: configKey,
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data.bean)
          this.setData({
            sharePic: res.data.bean.configValue,
            shareText: res.data.bean.description
          })
        }
      }
    })
  },
  /**
   * 排行榜触底事件
   */
  lower: function (e) {
    console.log(e)
    if (this.data.total > this.data.userPartake.length) {
      ++this.data.defaultPage
      this.setData({
        defaultPage: this.data.defaultPage
      })
      this.scrollRankList(this.data.defaultPage)
    }
  },
  /**
   * 上滑加载排行榜数据
   */
  scrollRankList: function (pageBegin) {
    wx.request({
      url: config.config.getRankList,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        pageBegin: pageBegin
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var scrollUserPartake = res.data.bean.userPartake
          var tempArray = this.data.userPartake
          tempArray = tempArray.concat(scrollUserPartake)
          this.setData({
            userPartake: tempArray
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.scrollRankList, this)
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
   * 判断是否可以助力
   */
  getCanAssistant: function () {
    wx.request({
      url: config.config.getCanHelpDice,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        shareUserId: this.data.shareUserId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // 调用助力接口
          // this.assistant()
          this.setData({
            assistanceStatus: 1,
            isShowAssis: true
          })
        } else if (res.data.status == 201) {
          // 不可以给自己助力，关闭助力弹框
          this.setData({
            isShowAssis: false
          })
          console.log("不可以给自己助力" + this.data.isShowAssis)
        } else if (res.data.status == 202) {
          // 活动已结束 关闭助力弹框
          this.setData({
            isShowAssis: false
          })
        } else if (res.data.status == 203) {
          // 好友助力机会已用完
          this.setData({
            isShowAssis: false
          })
        } else if (res.data.status == 204) {
          this.setData({
            isShowAssis: false
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getCanAssistant, this)
        }
      }
    })
  },

  /**
   * 助力
   */
  assistant: function () {
    wx.request({
      url: config.config.postHelpDice,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        shareUserId: this.data.shareUserId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data)
          // 助力成功动画
          this.setData({
            countstyle: 'display: block'
          })
          setTimeout(() => {
            this.setData({
              countstyle: 'display: none',
              isShowAssis: false
            })
            wx.showToast({
              title: '复活成功！',
              icon: 'none'
            })
          }, 800)
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.assistant)
          utils.getUserInfoFun(this.assistant, this)
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
   * 点击助力
   */
  addChance: function () {
    // 判断是否登录
    if (this.data.isLogin) {
      this.assistant()
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 助力弹框显示切换
   */
  toggleAssisDialog: function () {
    this.setData({
      isShowAssis: false
    })
  },
  gotoIndexx: function (e) {
    var notifyFormId = e.detail.formId
    wx.request({
      url: config.config.postDiceFormId,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        formId: notifyFormId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.gotoIndex, this)
        }
      }
    })
  },
  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  startGame: function (e) {
    this.setData({
      formId: e.detail.formId
    })
    if (this.data.isLogin) {
      if (this.data.status == 0) {
        if (this.data.chances > 0) {
          // 参加活动
          if (this.data.canClick) {
            var chances = parseInt(this.data.chances) - 1 
            this.setData({
              canClick: false,
              chances: chances
            })
            this.joinGame(this.data.formId)
          }
        } else {
          wx.showToast({
            title: '免费机会已用完，点击获得复活卡获得新的机会～',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '活动已结束！',
          icon: 'none'
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  continuGame: function (e) {
    if (this.data.status == 0) {
      console.log(this.data.chances)
      if (this.data.chances > 0) {
        // 关闭 继续参加活动
        this.setData({
          isShowPop: false,
          isClick: false
        })
        // 更新成绩 
        this.getDicePartakeDetail()
      } else {
        wx.showToast({
          title: '免费机会已用完，点击“喊好友助力挑战高分”获得新的机会~',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '活动已结束！',
        icon: 'none'
      })
    }
  },
  closePop: function (e) {
    var notifyFormId = e.detail.formId
    wx.request({
      url: config.config.postDiceFormId,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        formId: notifyFormId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            isShowPop: false,
            isClick: false
          })
          // 更新成绩 
          this.getDicePartakeDetail()
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.closePop, this)
        }
      }
    })
  },
  /**
   * 参加活动
   */
  joinGame: function (formId) {
    wx.request({
      url: config.config.postJoinDiceActivity,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        formId: formId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // 旋转
          this.setData({
            isClick: true,
            diceNumber: res.data.bean.hitNum,
            totalNumber: res.data.bean.hitNumNew            
          })
          // 弹出点子框
          setTimeout(() => {
            this.setData({
              isShowPop: true
            })
          }, 600)
          setTimeout(() => {
            this.setData({
              canClick: true
            })
          }, 1200)
          // this.getDiceNumber()
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.joinGame, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          this.setData({
            canClick: true
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
      ordersId: options.ordersId,
      shareUserId: options.shareUserId
    })
  },
  /**
   * 获取送礼详情
   */
  getDicePartakeDetail: function () {
    wx.request({
      url: config.config.getDiceOrderDetail,
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
          wx.stopPullDownRefresh()
          var userPartakeGeneral = res.data.bean.userPartakeGeneral;
          var userPartake = res.data.bean.userPartake;
          var freeOrders = res.data.bean.freeOrders;
          var freeOrdersItems = res.data.bean.freeOrdersItems
          var nickname = res.data.bean.nickname
          var userMaker = res.data.bean.userMaker
          var userPartakeGeneralNum = res.data.bean.userPartakeGeneralNum
          var freeOrdersNumber = res.data.bean.itemNumTotal
          this.getSharePic('dice' + freeOrdersNumber)
          this.setData({
            freeOrders: freeOrders,
            userPartakeGeneral: userPartakeGeneral,
            userPartake: userPartake,
            freeOrdersItems: freeOrdersItems,
            nickname: nickname,
            userMaker: userMaker,
            consumeChances: res.data.bean.consumeChances,
            chances: res.data.bean.chances,
            hitNum: res.data.bean.hitNum,
            userPartakeGeneralNum: userPartakeGeneralNum,
            status: res.data.bean.userMaker.status,
            rankingNum: res.data.bean.rankingNum,
            userId: res.data.bean.partakeUserId,
            freeOrdersNumber: freeOrdersNumber,
            userBingoList: res.data.bean.userBingoList,
            total: res.data.total,
            consumeTime: res.data.bean.consumeTime || ''
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getDicePartakeDetail, this)
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
        this.getDicePartakeDetail()
        // 调用 判读是否助力过接口
        this.getCanAssistant()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getDicePartakeDetail()
        // 显示助力弹框
        this.setData({
          assistanceStatus: 1,
          isShowAssis: true
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getDicePartakeDetail()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      if (res.target.id == 'getRelive' || res.target.id == 'getRelive2') {
        wx.request({
          url: config.config.postShareNumber,
          data: {
            ordersId: this.data.ordersId
          },
          method: 'POST',
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            if (res.data.status == 200) {
              console.log('点击分享了')
            }
          }
        })
        return {
          title: this.data.shareText,
          path: '/pages/activityDiceHelp/activityDiceHelp?ordersId=' + this.data.ordersId + '&shareUserId=' + this.data.userId,
          imageUrl: this.data.sharePic
        }
      } else {
        return {
          title: '摇骰子赢好礼，速来PK！',
          path: '/pages/activityDice/activityDice?ordersId=' + this.data.ordersId,
          imageUrl: 'https://image.prise.shop/images/2018/09/06/1536223833182987.png'
        }
      }
    } else {
      return {
        title: '摇骰子赢好礼，速来PK！',
        path: '/pages/activityDice/activityDice?ordersId=' + this.data.ordersId,
        imageUrl: 'https://image.prise.shop/images/2018/09/06/1536223833182987.png'
      }
    }
  }
})
// pages/diceGame/diceGame.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canClick: true
  },
  /**
   * 判断是否可以助力
   */
  getCanAssistant: function () {
    wx.request({
      url: config.config.getCanHelpDiceGift,
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
      url: config.config.postHelpDiceGift,
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
      url: config.config.postSubmitDiceFormid,
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
            this.setData({
              canClick: false
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
  closePop: function (e) {
    var notifyFormId = e.detail.formId
    wx.request({
      url: config.config.postSubmitDiceFormid,
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
      url: config.config.postJoinDiceGame,
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
            diceNumber: res.data.bean
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
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.joinGame)
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
      url: config.config.getDiceDetails,
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
          var ordersItems = res.data.bean.ordersItems
          var nickname = res.data.bean.nickname
          var userMaker = res.data.bean.userMaker
          var userPartakeGeneralNum = res.data.bean.userPartakeGeneralNum
          var ordersInfo = res.data.bean.orders
          this.setData({
            userPartakeGeneral: userPartakeGeneral,
            userPartake: userPartake,
            ordersItems: ordersItems,
            ordersInfo: ordersInfo,
            nickname: nickname,
            userMaker: userMaker,
            consumeChances: res.data.bean.consumeChances,
            chances: res.data.bean.chances,
            hitNum: res.data.bean.hitNum,
            userPartakeGeneralNum: userPartakeGeneralNum,
            status: res.data.bean.userMaker.status,
            rankingNum: res.data.bean.rankingNum,
            userId: res.data.bean.partakeUserId,
            userBingoList: res.data.bean.userBingoList
          })
          var param = {}
          for (var i in ordersItems) {
            param.propName = JSON.parse(ordersItems[i].productParamText).propName
            param.price = JSON.parse(ordersItems[i].productParamText).price
            // 设置解析后的属性的值
            this.setData({
              ['ordersItems[' + i + '].productParamText']: param
            })
          }
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

          }
        })
        return {
          title: '我正在参与摇骰子赢大礼，只差一张你的复活卡!',
          path: '/pages/diceGameHelp/diceGameHelp?ordersId=' + this.data.ordersId + '&shareUserId=' + this.data.userId,
          imageUrl: 'https://image.prise.shop/images/2018/09/07/1536290586352534.png'
        }
      } else {
        return {
          title: '摇骰子赢好礼，速来PK！',
          path: '/pages/diceGame/diceGame?ordersId=' + this.data.ordersId,
          imageUrl: 'https://image.prise.shop/images/2018/09/06/1536223833182987.png'
        }
      }
    } else {
      return {
        title: '摇骰子赢好礼，速来PK！',
        path: '/pages/diceGame/diceGame?ordersId=' + this.data.ordersId,
        imageUrl: 'https://image.prise.shop/images/2018/09/06/1536223833182987.png'
      }
    }
  }
})
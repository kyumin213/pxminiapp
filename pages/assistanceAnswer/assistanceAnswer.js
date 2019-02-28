// pages/answerGame/answerGame.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTips: true,
  },
  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 判断是否可以助力
   */
  getCanAssistant: function () {
    wx.request({
      url: config.config.getCanAssistantAnswer,
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
          // this.getUserInfoFun(this.getCanAssistant)
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
      url: config.config.postAssistAnswer,
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
          utils.getUserInfoFun(this.assistant,this)
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
  // 显示活动规则
  togglePopBox: function () {
    this.setData({
      showRuleBox: !this.data.showRuleBox
    })
  },
  // 去到答题页面
  gotoGameCenter: function (e) {
    console.log("formId:" + e.detail.formId)
    if (this.data.isLogin) {
      var formId = e.detail.formId
      if (this.data.status == 0) {
        if (this.data.chances != 0) {
          this.joinGames(formId)
        } else {
          wx.showToast({
            title: '免费答题机会已用完，点击获得复活卡获得答题机会～',
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
  joinGames: function (formId) {
    wx.request({
      url: config.config.postJoinAnswerGame,
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
          var userId = res.data.bean.userId
          wx.navigateTo({
            url: '/pages/answerGameCenter/answerGameCenter?ordersId=' + this.data.ordersId + '&qustionNumber=' + this.data.qustionNumber + '&formId=' + formId + '&userId=' + userId,
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.joinGames)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.ordersId) {
      this.setData({
        ordersId: options.ordersId,
        shareUserId: options.shareUserId
      })
    }
    setTimeout(() => {
      this.setData({
        showTips: false
      })
    }, 2000)
    setTimeout(() => {
      this.setData({
        hidetip: true
      })
    }, 2500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 获取答题游戏详情
   */
  getAnswerCard: function () {
    wx.request({
      url: config.config.getAnswerCardInfo,
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
          if (res.data.bean) {
            var shareUserId = res.data.bean.ordersUserChanceVo != '' ? res.data.bean.ordersUserChanceVo.userId : ''
            var itemList = res.data.bean.ordersView.itemVoList
            if (itemList.length > 2) {
              this.setData({
                isShowMore: true,
                heightstyle: '494rpx'
              })
            }
            // var itemlistsub = itemList.splice(0, 2)
            var userReceiver = res.data.bean.ordersView.userReceiver ? res.data.bean.ordersView.userReceiver : ""
            this.setData({
              ordersItemNum: res.data.bean.ordersView.ordersItemNum,
              deadline: res.data.bean.ordersView.deadline,
              status: res.data.bean.ordersView.giftStatus,
              itemList: itemList,
              userMaker: res.data.bean.ordersView.userMaker,
              userReceiver: userReceiver,
              qustionNumber: res.data.bean.keys,
              userPartake: res.data.bean.userPartake,
              chances: res.data.bean.chances,
              consumeChances: res.data.bean.consumeChances,
              gameConsumeTime: res.data.bean.gameConsumeTime,
              hitNum: res.data.bean.hitNum,
              userPartakeGeneral: res.data.bean.userPartakeGeneral,
              userPartakeGeneralNum: res.data.bean.userPartakeGeneralNum,
              userId: shareUserId
            })
            var param = {}
            for (var i in itemList) {
              param.propName = JSON.parse(itemList[i].productParamText).propName
              this.setData({
                ['itemList[' + i + '].productParamText']: param
              })
            }
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getPintuCard, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  toggleItem: function () {
    if (this.data.heightstyle == '494rpx') {
      this.setData({
        heightstyle: 200 * this.data.itemList.length + 94 + 'rpx',
        up: true
      })
    } else {
      this.setData({
        heightstyle: '494rpx',
        up: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        this.getAnswerCard()
        this.getCanAssistant()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getAnswerCard()
        // 显示助力弹框
        this.setData({
          assistanceStatus: 1,
          isShowAssis: true
        })
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
    this.getAnswerCard()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      if (res.target.id == 'getRelive') {
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
          title: '我正在参与答题赢大礼，只差一张你的复活卡!',
          path: '/pages/assistanceAnswer/assistanceAnswer?ordersId=' + this.data.ordersId + '&shareUserId=' + this.data.userId,
          imageUrl: 'https://image.prise.shop/images/2018/07/05/1530775084567947.png'
        }
      } else if (res.target.id == 'joinGame') {
        return {
          title: '放开这道题，让我来!',
          path: '/pages/answerGame/answerGame?ordersId=' + this.data.ordersId,
          imageUrl: 'https://image.prise.shop/images/2018/07/05/1530775081468058.png'
        }
      }
    } else {
      return {
        title: '放开这道题，让我来!',
        path: '/pages/answerGame/answerGame?ordersId=' + this.data.ordersId,
        imageUrl: 'https://image.prise.shop/images/2018/07/05/1530775081468058.png'
      }
    }
  }
})
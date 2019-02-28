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
    up: false,
    hidetip: true,
    userBingoList: [],
    defaultPage: 1
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
      url: config.config.getRankListAnswer,
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
  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
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
      url: config.config.postJoinActivityAnswer,
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
          // wx.navigateTo({
          //   url: '',
          // })
          wx.navigateTo({
            url: '/pages/activityAnswerGameCenter/activityAnswerGameCenter?ordersId=' + this.data.ordersId + '&qustionNumber=' + this.data.qustionNumber + '&userId=' + userId,
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
        ordersId: options.ordersId
      })
    }
    setTimeout(() => {
      this.setData({
        hidetip: false
      })
    }, 1500)
    setTimeout(() => {
      this.setData({
        showTips: false
      })
    }, 5000)
    setTimeout(() => {
      this.setData({
        hidetip: true
      })
    }, 5500)
  },

  /**
   * 获取答题游戏详情
   */
  getAnswerCard: function () {
    wx.request({
      url: config.config.getActivityAnswerInfo,
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
            var itemList = res.data.bean.freeOrdersItems
            if (itemList.length > 2) {
              this.setData({
                isShowMore: true,
                heightstyle: '494rpx'
              })
            }
            // var itemlistsub = itemList.splice(0, 2)
            this.setData({
              ordersItemNum: res.data.bean.userPartakeGeneralNum,
              deadline: res.data.bean.freeOrders.endTime,
              status: res.data.bean.userMaker.status,
              itemList: itemList,
              userMaker: res.data.bean.userMaker,
              qustionNumber: res.data.bean.keys,
              userPartake: res.data.bean.userPartake,
              chances: res.data.bean.chances,
              gameConsumeTime: res.data.bean.consumeTime,
              hitNum: res.data.bean.hitNum,
              userPartakeGeneral: res.data.bean.userPartakeGeneral,
              userPartakeGeneralNum: res.data.bean.userPartakeGeneralNum,
              userBingoList: res.data.bean.userBingoList,
              shareUserId: res.data.bean.partakeUserId,
              total: res.data.total,
              totalNum: res.data.bean.itemNumTotal
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
        this.getAnswerCard()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getAnswerCard()
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getAnswerCard()
    this.setData({
      up: false
    })
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
          path: '/pages/assistanceActivityAnswer/assistanceActivityAnswer?ordersId=' + this.data.ordersId + '&shareUserId=' + this.data.shareUserId,
          imageUrl: 'https://image.prise.shop/images/2018/07/05/1530775084567947.png'
        }
      } else {
        //  if (res.target.id == 'joinGame')
        return {
          title: '答题有奖，够快够准就能稳赢！',
          path: '/pages/activityAnswer/activityAnswer?ordersId=' + this.data.ordersId,
          imageUrl: 'https://image.prise.shop/images/2018/07/05/1530775081468058.png'
        }
      }
    } else {
      return {
        title: '答题有奖，够快够准就能稳赢！',
        path: '/pages/activityAnswer/activityAnswer?ordersId=' + this.data.ordersId,
        imageUrl: 'https://image.prise.shop/images/2018/07/05/1530775081468058.png'
      }
    }
  }
})
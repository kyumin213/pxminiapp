// pages/activity/activity.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTalk: 0,
    fuckText: '',
    messageList: [],
    freeOrdersItems: [],
    isShowPop: false,
    freeOrders:{},
  },
  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
    // wx.navigateTo({
    //   url: '/pages/special/special?id=SL1534497732291&title=教师节',
    // })
  },
  /**
   * 精彩吐槽 最新吐槽切换
   */
  switchNav: function(e) {
    var index = e.currentTarget.dataset.index
    console.log(index);
    this.setData({
      currentTalk: index
    })
    this.getUserSwicthPartake(this.data.currentTalk);
  },
  /**
   * 获取精彩吐槽 最新吐槽
   */
  getUserSwicthPartake: function(index) {
    wx.request({
      url: config.config.swichPartakeFuck,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId, 
        choose: index,
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          var userPartakeGeneral = res.data.bean.userPartakeGeneral;
          this.setData({
            messageList: userPartakeGeneral,
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getUserSwicthPartake, this)
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
   * 弹出框切换
   */
  togglePopDialog: function(e) {
    if (this.data.isLogin) {
      if (this.data.userMaker.status == 0) {
        console.log(e);
        var notifyFormId = e.detail.formId;   
        wx.request({
          url: config.config.addFreePartake,
          data: {
            token: this.data.token,
            ordersId: this.data.ordersId,
            formId: notifyFormId,
          },
          method: 'POST',
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            if (res.data.status == 200) {
              console.log(res.data.bean);
              this.setData({
                isShowPop: !this.data.isShowPop
              })
            } else if (res.data.status == 801) {
              utils.getUserInfoFun(this.togglePopDialog, this)
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }
        })
      } else if (this.data.userMaker.status == 1) {
        wx.showToast({
          title: '活动已结束！',
          icon: 'none'
        })
      }
    } else if (this.data.userMaker.status == 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 去到邀请页面
   */
  gotoInvite: function() {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/inviteFriend/inviteFriend?ordersId=' + this.data.ordersId + '&nickname=' + this.data.nickname,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 提交吐槽
   */
  submitTalk: function(e) {
    var notifyFormId = e.detail.formId
    this.setData({
      isShowPop: !this.data.isShowPop
    })
    if (this.data.fuckText == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
    } else {
      wx.request({
        url: config.config.submitFuck,
        data: {
          token: this.data.token,
          ordersId: this.data.ordersId,
          formId: notifyFormId,
          fuckContent: this.data.fuckText
        },
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            wx.showToast({
              title: '吐槽成功!',
              icon: 'none'
            })
            this.getUserSwicthPartake(this.data.currentTalk);
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.submitTalk, this)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }
  },

  /***
   *  获取吐槽文本框的值
   */

  bindTextAreaBlur: function(e) {
    this.setData({
      fuckText: e.detail.value
    })
  },
  addLikes: function (e) {
    var index = e.currentTarget.dataset.index;
    var userId = this.data.messageList[index].userId
    // var userId = e.currentTarget.dataset.userid;
    console.log(e);
    wx.request({
      url: config.config.addFreeLikes,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        fuckUserId: userId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // 助力成功动画
          this.setData({
            // countstyle: 'display: block',
            ['messageList[' + index + '].countstyle']: 'display: block'
          })
          setTimeout(() => {
            this.setData({
              // countstyle: 'display: none',
              ['messageList[' + index + '].countstyle']: 'display: none',
            })
            // 更新列表
            this.getUserSwicthPartake(this.data.currentTalk)
            // this.getFuckPartakeDetail()
          }, 800)
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.addLikes, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })

  },
  /***
   * 获取抽奖情况
   */
  getFuckPartakeDetail: function () {
    wx.request({
      url: config.config.whatchPartakeDetail,
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
          var freeOrders = res.data.bean.freeOrders;
          var freeOrdersItems = res.data.bean.freeOrdersItems
          var nickname = res.data.bean.nickname
          var userMaker = res.data.bean.userMaker
          this.setData({
            freeOrders: freeOrders,
            messageList: userPartakeGeneral,
            freeOrdersItems: freeOrdersItems,
            nickname: nickname,
            userMaker: userMaker,
            itemNumTotal: res.data.bean.itemNumTotal
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getFuckPartakeDetail, this)
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
  onLoad: function(options) {
    this.setData({
      ordersId: options.ordersId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
        this.getFuckPartakeDetail()
        this.getUserSwicthPartake(this.data.currentTalk)
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getFuckPartakeDetail()
        this.getUserSwicthPartake(this.data.currentTalk)
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getFuckPartakeDetail()
    this.getUserSwicthPartake(this.data.currentTalk)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.nickname + '邀请你一起参与吐槽赢大礼，快进来一起吐槽吧!',
      path: '/pages/activity/activity?ordersId=' + this.data.ordersId,
      imageUrl: 'https://image.prise.shop/images/2018/07/27/1532662233109304.png',
      success: (res) => {
        console.log("分享成功")
        // this.getCoupon();
      },
    }
  }
})
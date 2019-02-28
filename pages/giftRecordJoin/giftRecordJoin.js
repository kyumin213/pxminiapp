const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: ["未开奖", "已开奖", "已中奖", "已发货", "未发货", "未中奖", "已退款"], 
    statusTips: ["好友正在寻找你", "礼物已成功送出", "恭喜你！礼物已悄悄领取！", "礼物正在途中，请耐心等待", "小派正在为你准备礼物中", "礼物已被悄悄领走，再接再厉哦！","",],
    remarks: ''
  },
  getRecordDetails: function () {
    wx.request({
      url: config.config.getGiftCardDetails,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        category: 3
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var itemList = res.data.bean.itemVoList
          var orderInfo = res.data.bean
          var userMaker = res.data.bean.userMaker
          var remarks = res.data.bean.remarks
          this.setData({
            orderInfo: orderInfo,
            itemList: itemList,
            userMaker: userMaker,
            remarks: remarks
          })
          var param = {}
          for (var i in itemList) {
            param.propName = JSON.parse(itemList[i].productParamText).propName
            this.setData({
              ['itemList[' + i + '].productParamText']: param
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getRecordDetails, this)
        }
      }
    })
  },
  sendCard: function (e) {
    var ordersId = e.currentTarget.dataset.id
    var status = this.data.orderInfo.giftStatus
    wx.navigateTo({
      url: '/pages/giftCard/giftCard?ordersId=' + ordersId + '&status=' + status,
    })
  },
  gotoCardReceivers: function (e) {
    var ordersId = e.currentTarget.dataset.id
    var status = this.data.orderInfo.giftStatus
    if (this.data.orderInfo.addressWay == 2) {
      wx.navigateTo({
        url: '/pages/openBox/openBox?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 1) {
      wx.navigateTo({
        url: '/pages/giftsCardReceiver/giftsCardReceiver?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 3)  {
      wx.navigateTo({
        url: '/pages/pintuGame/pintuGame?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 4) {
      wx.navigateTo({
        url: '/pages/answerGame/answerGame?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 5) {
      wx.navigateTo({
        url: '/pages/activity/activity?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 6) {
      wx.navigateTo({
        url: '/pages/activityPintu/activityPintu?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 7) {
      wx.navigateTo({
        url: '/pages/activityAnswer/activityAnswer?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 8) {
      if (this.data.orderInfo.giftStatus != 0) {
        wx.navigateTo({
          url: '/pages/groupReceiver/groupReceiver?ordersId=' + ordersId,
        })
      } else {
        wx.navigateTo({
          url: '/pages/groupSender/groupSender?ordersId=' + ordersId,
        })
      }
    } else if (this.data.orderInfo.addressWay == 9) {
      wx.navigateTo({
        url: '/pages/activityDice/activityDice?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 10) {
      wx.navigateTo({
        url: '/pages/diceGame/diceGame?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 11) {
      wx.navigateTo({
        url: '/pages/directReceiver/directReceiver?ordersId=' + ordersId,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ordersId: options.ordersId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        console.log(res.data)
        this.setData({
          token: res.data
        })
        this.getRecordDetails()
      },
      fail: (res) => {
        // this.getUserInfoFun(this.getRecordDetails)
        utils.getUserInfoFun(this.getRecordDetails, this)
      }
    })
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
    wx.stopPullDownRefresh()
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

  }
})
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: ["未开奖", "已开奖", "已中奖", "已发货", "未发货", "未中奖", "已退款"], 
    statusTips: ["好友正在等待你送出礼物", "礼物已成功送出", "恭喜你！礼物已悄悄领取！", "礼物正在途中，请耐心等待", "小派正在为你准备礼物中", "礼物已被悄悄领走，再接再厉哦！", "超过15天礼物未被领取，已完成退款",]
  },
  getRecordDetails: function () {
    wx.request({
      url: config.config.getGiftCardDetails,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        category: 1
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var itemList = res.data.bean.itemVoList
          var orderInfo = res.data.bean
          var userReceiver = res.data.bean.userReceiver ? res.data.bean.userReceiver:''
          var remarks = res.data.bean.remarks
          this.setData({
            orderInfo: orderInfo,
            itemList: itemList,
            userReceiver: userReceiver,
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
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  sendCard: function (e) {
    var ordersId = e.currentTarget.dataset.id
    var status = this.data.orderInfo.giftStatus
    if (this.data.orderInfo.addressWay == 2) {
      wx.navigateTo({
        url: '/pages/giftCardBox/giftCardBox?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 1) {
      wx.navigateTo({
        url: '/pages/giftCard/giftCard?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 3) {
      wx.navigateTo({
        url: '/pages/giftCardPintu/giftCardPintu?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 4) {
      wx.navigateTo({
        url: '/pages/giftCardAnswer/giftCardAnswer?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 8) {
      wx.navigateTo({
        url: '/pages/giftCardGroup/giftCardGroup?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 10) {
      wx.navigateTo({
        url: '/pages/giftCardDice/giftCardDice?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 11) {
      wx.navigateTo({
        url: '/pages/giftCardDirect/giftCardDirect?ordersId=' + ordersId,
      })
    }
  },
  gotoGameCenter: function (e) {
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
    } else if (this.data.orderInfo.addressWay == 3) {
      wx.navigateTo({
        url: '/pages/pintuGame/pintuGame?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 4) {
      wx.navigateTo({
        url: '/pages/answerGame/answerGame?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 8) {
      wx.navigateTo({
        url: '/pages/groupSender/groupSender?ordersId=' + ordersId,
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
  gotoCardStatus: function (e) {
    var ordersId = e.currentTarget.dataset.id
    var status = this.data.orderInfo.giftStatus    
    if (this.data.orderInfo.addressWay == 2) {
      wx.navigateTo({
        url: '/pages/openBox/openBox?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 1){
      wx.navigateTo({
        url: '/pages/giftCardStatus/giftCardStatus?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 3) {
      wx.navigateTo({
        url: '/pages/pintuGame/pintuGame?ordersId=' + ordersId + '&status=' + status,
      })
    } else if (this.data.orderInfo.addressWay == 4) {
      wx.navigateTo({
        url: '/pages/answerGame/answerGame?ordersId=' + ordersId,
      })
    } else if (this.data.orderInfo.addressWay == 8) {
      wx.navigateTo({
        url: '/pages/groupSender/groupSender?ordersId=' + ordersId,
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleTxt: ["好友正在寻找你-先逛逛派喜吧！", "礼物已被悄悄领走-去逛逛派喜吧！ "],
    statusTip: ["礼物等待领取中", "礼物已被领取"],
    userPartake: []
  },
  selectReceiver: function () {
    wx.navigateTo({
      url: '/pages/selectReceiver/selectReceiver?ordersId=' + this.data.ordersId,
    })
  },
  gotoGifts: function () {
    wx.reLaunch({
      url: '/pages/gifts/gifts',
    })
  },
  gontoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: 0,
      ordersId: options.ordersId
    })
    console.log(this.data.status)
    for (var i in this.data.titleTxt) {
      this.setData({
        ['titleTxt[' + i + ']']: this.data.titleTxt[i].split("-")
      })
    }
  },
  getCardInfo: function () {
    wx.request({
      url: config.config.getGiftCardInfo,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if(res.data.status == 200) {
          wx.stopPullDownRefresh()
          var itemList = res.data.bean.ordersView.itemVoList
          if (itemList.length > 3) {
            this.setData({
              isShowMore: true
            })
          }
          var itemlistsub = itemList.splice(0, 3)
          var orderInfo = res.data.bean.ordersView
          var userPartake = res.data.bean.userPartake
          this.setData({
            itemList: itemlistsub,
            orderInfo: orderInfo,
            userPartake: userPartake
          })
        }
      }
    })
  },
  showAllItem: function () {
    this.setData({
      scrollHeight: '800rpx',
      isShowMore: false
    })
    wx.request({
      url: config.config.getGiftCardInfo,
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
          var itemList = res.data.bean.ordersView.itemVoList
          this.setData({
            ordersItemNum: res.data.bean.ordersView.ordersItemNum,
            itemList: itemList,
            userPartake: res.data.bean.userPartake
          })
          var param = {}
          for (var i in itemList) {
            param.propName = JSON.parse(itemList[i].productParamText).propName
            this.setData({
              ['itemList[' + i + '].productParamText']: param
            })
          }
        }
      }
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
        if (res.data) {
          this.setData({
            token: res.data
          })
        }
        this.getCardInfo()
      },
      fail: (res) => {
        this.setData({
          token: app.globalData.token
        })
        this.getUserInfoFun(this.getCardInfo)
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
    this.getCardInfo()
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
      title: 'TA悄悄为你送出的礼物',
      path: '/pages/giftsCardReceiver/giftsCardReceiver?ordersId=' + this.data.ordersId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
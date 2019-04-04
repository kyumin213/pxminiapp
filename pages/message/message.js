// pages/message/message.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    token: app.globalData.token,
    defaultPage: 1
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync("token") || 'paixi_123'
    this.setData({
      token: token
    })
    this.getMessageList()
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
    // if (this.data.messageList.length > 10 * this.data.defaultPage - 1) {
    if (this.data.total > this.data.messageList.length) {
      ++this.data.defaultPage
      this.setData({
        defaultPage: this.data.defaultPage
      })
      this.onreachBottomMessageList(this.data.defaultPage)
    }
  },

  getMessageList: function () {
    wx.request({
      url: config.config.getMessage,
      data: {
        token: this.data.token,
        pageBegin: 1,
        pageSize: 10
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data.bean)
          this.setData({
            messageList: res.data.bean || [],
            total: res.data.total
          })
        } else if (res.data.status == 801){
          utils.getUserInfoFun(this.getMessageList, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  onreachBottomMessageList: function (pageBegin) {
    wx.request({
      url: config.config.getMessage,
      data: {
        token: this.data.token,
        pageBegin: pageBegin,
        pageSize: 10
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var len = this.data.messageList.length
          var refreshBeforePay = res.data.bean
          var tempArray = this.data.messageList
          tempArray = tempArray.concat(refreshBeforePay)
          this.setData({
            messageList: tempArray
          })
          console.log(this.data.messageList.length)
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.onreachBottomMessageList, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  }
})
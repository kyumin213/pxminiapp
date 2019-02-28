// pages/selectReceiver/selectReceiver.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: null,
    isShowDialog: false,
    addressId: ''
  },
  getReceiverList: function () {
    wx.request({
      url: config.config.getReceiverList,
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
          var userList = res.data.bean
          this.setData({
            userList: userList,
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getReceiverList, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  selectOption: function (e) {
    var index = e.currentTarget.dataset.index;
    var addressId = this.data.userList[index].addressId
    var userName = this.data.userList[index].nickname
    var userPic = this.data.userList[index].picture
    console.log(index)
    this.setData({
      current: index,
      // isShowDialog: true,
      addressId: addressId,
      userName: userName,
      userPic: userPic
    })
  },
  toggleDialog: function () {
    this.setData({
      isShowDialog: false
    })
  },
  confirmSecond: function () {
    this.setData({
      isShowDialog: false
    })
    wx.request({
      url: config.config.postConfirmReceiver,
      method: 'POST',
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        addressId: this.data.addressId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.navigateTo({
            url: '/pages/sendResult/sendResult',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.confirmSecond, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  sendGifts: function () {
    if (this.data.current == null) {
      wx.showToast({
        title: '还没有选择收礼人哦！',
        icon: 'none'
      })
    } else {
      this.setData({
        isShowDialog: true
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
        this.getReceiverList()
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
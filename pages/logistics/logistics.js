// pages/logistics/logistics.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticsInfo: []
  },
  getLogistics: function () {
    wx.request({
      url: config.config.getLogistictsByOrder,
      data: {
        token: this.data.token,
        shipperCode: 'shunfeng',
        ordersId: this.data.ordersId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(typeof (res.data.bean))
          if (JSON.parse(res.data.bean).status == 200) {
            var logisticsInfo = JSON.parse(res.data.bean).data
            var ischeck = JSON.parse(res.data.bean).ischeck
            var state = JSON.parse(res.data.bean).state
            this.setData({
              logisticsInfo: logisticsInfo,
              ischeck: ischeck,
              state: state
            })
          } else if (JSON.parse(res.data.bean).returnCode == 500){
            this.setData({
              emptyMsg: true
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getLogistics, this)
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
        this.setData({
          token: res.data
        })
        this.getLogistics()
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})
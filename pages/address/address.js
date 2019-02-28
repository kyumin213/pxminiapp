// pages/address/address.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.token) {
      console.log(app.globalData.token)
      this.setData({
        token: app.globalData.token
      })
      this.getAddressList()
    } 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getAddressList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  /**
   * 获取用户地址列表
   */
  getAddressList: function () {
    wx.request({
      url: config.config.getAddressList,
      data: {
        token: this.data.token,
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          var addressList = res.data.bean
          this.setData({
            addressList: addressList
          })
        }
      }
    })
  },
  addAddress: function () {
    wx.chooseAddress({
      success: (res) => {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
        wx.request({
          url: config.config.getAddRess,
          method: 'POST',
          data: {
            token: this.data.token,
            receiver: res.userName,
            phone: res.telNumber,
            province: res.provinceName,
            city: res.cityName,
            district: res.countyName,
            detailed: res.detailInfo,
            longitude: '',
            latitude: '',
            location: ''
          },
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            if (res.data.status == 200) {
              console.log(res.data)
              this.getAddressList()
            } else if (res.data.status == 402) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }
        })
      }
    })
  }
})
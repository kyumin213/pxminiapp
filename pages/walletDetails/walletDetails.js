// pages/walletDetails/walletDetails.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
     accountDetail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month > 9 ? month : '0' + month
    this.setData({
      end: year + '-' + month
    })
  },
  
  /**
   * 滑动
   */
  scroll: function (e) {
    console.log(e.detail.scrollTop)
    this.setData({
      scrollTop: e.detail.scrollTop,
      toView: 'month1'
    })
  },

  bindclick: function (e) {
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value + '-01')
    this.setData({
      date: e.detail.value + '-01'
    })
    this.searchAccountDetails()
  },
  searchAccountDetails: function () {
    utils.httpRequestGet(config.config.getAccountDetails,
      {
        token: this.data.token,
        created: this.data.date
      }, (res) => {
        if (res.data.status == 200) {
          this.setData({
            accountDetail: res.data.bean || []
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.searchAccountDetails, this)
        } else {
          utils.showTips(res.data.msg)
        }
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu()
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        this.getDetails()
      }
    })
  },
  /**
   * 查询明细
   */
  getDetails: function () {    
    utils.httpRequestGet(config.config.getAccountDetails, {token: this.data.token}, (res) => {
      if(res.data.status == 200) {
        this.setData({
          accountDetail: res.data.bean || []
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getDetails, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getDetails()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // if (this.data.total > this.data.accountDetail.length) {
    //   ++this.data.defaultPage
    //   this.setData({
    //     defaultPage: this.data.defaultPage
    //   })
    //   this.onreachBottomMessageList(this.data.defaultPage)
    // }
  },
})
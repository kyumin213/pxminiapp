// packageA/pages/strategy/strategy.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1
  },
  goback: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  switchTab: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      current: index
    })
  },
  gotoRewards: function () {
    wx.navigateTo({
      url: '/packageA/pages/rewards/rewards',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.toLowerCase().indexOf('iphone x') > -1) {
          this.setData({
            iphonex: true
          })
        }
      },
    })
  },
  // 获取文章内容
  getArticle: function () {
    wx.request({
      url: 'https://api.prise.shop/major/recruit/select/all',
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var content = res.data.bean[0].requirement
          this.setData({
            content: res.data.bean[0].requirement
          })
          WxParse.wxParse('content', 'html', content, this, 5);
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
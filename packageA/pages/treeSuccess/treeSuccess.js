Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  gotoWishing: function () {
    wx.reLaunch({
      url: '/packageA/pages/wishing/wishing',
    })
  },
  goIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})
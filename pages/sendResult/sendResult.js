// pages/sendResult/sendResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  gotoRecord: function () {
    wx.navigateTo({
      url: '/pages/giftRecord/giftRecord',
    })
  },
  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
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
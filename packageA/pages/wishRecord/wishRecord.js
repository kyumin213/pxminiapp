const app = getApp()
const utils = require('../../../utils/util.js')
const config = require('../../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navName: ["当前愿望","领取记录"],
    currentNavtab: 0,
    statustxt: ["", "树苗期", "成长期", "大树期", "开花期", "已结果", "掉落"],
    orderStatus: ["已取消", "待付款", "待发货", "已发货", "提醒发货", "仅退款", "退货退款", "已收货", "已评价", "已退款"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '当前愿望'
    })
    wx.hideShareMenu()
  },
  /**
   * 导航切换
   */
  swichNav: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentNavtab: index
    })
    if (index == 0) {
      wx.setNavigationBarTitle({
        title: '当前愿望'
      })
    } else if (index == 1) {    
      wx.setNavigationBarTitle({
        title: '领取记录'
      })
      this.getRecordList()
    }
  },
  /**
   * 获取领取记录
   */
  getRecordList: function () {
    utils.httpRequestGet(config.config.getWishRecordList, {token: this.data.token}, (res) => {
      if (res.data.status == 200) {
        this.setData({
          recordList: res.data.bean,
          isLoading: true
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getRecordList, this)
        this.setData({
          isLoading: true
        })
      } else {
        utils.showTips(res.data.msg)
        this.setData({
          isLoading: true
        })
      } 
    })
  },
  /**
   * 去记录详情
   */
  gotoDetail: function (e) {
    if (this.data.currentNavtab == 1) {
      var index = e.currentTarget.dataset.index
      var ordersId = this.data.recordList[index].id
      wx.navigateTo({
        url: '/packageA/pages/wishRecordDetails/wishRecordDetails?ordersId=' + ordersId + '&currentNavtab=' + this.data.currentNavtab,
      })
    } else {
      console.log()
      var ordersId = this.data.wishInfo.id
      wx.navigateTo({
        url: '/packageA/pages/wishRecordDetails/wishRecordDetails?ordersId=' + ordersId + '&currentNavtab=' + this.data.currentNavtab,
      })
    }    
  },

  gotoTree: function () {
    wx.navigateTo({
      url: '/packageA/pages/wishTree/wishTree',
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
    var token = wx.getStorageSync("token") || "paixi_123"
    this.setData({
      token: token
    })
    this.getWishNow()
  },
  /**
   * 获取当前愿望
   */
  getWishNow: function () {    
    utils.httpRequestGet(config.config.getWishRecordNow, {token: this.data.token}, (res) => {
      wx.stopPullDownRefresh()
      if (res.data.status == 200) {
        this.setData({
          wishInfo: res.data.bean || null,
          isLoading: true
        })
      } else if(res.data.status == 801) {
        utils.getUserInfoFun(this.getWishNow, this)
        this.setData({
          isLoading: true
        })
      } else {
        utils.showTips(res.data.msg)
        this.setData({
          isLoading: true
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      currentNavtab: 0
    })
    this.getWishNow()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
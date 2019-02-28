// pages/inviteFriend/inviteFriend.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList:[],
    hasCoupon: true,
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
      this.getFuckPartakeDetail()
    } 
    this.setData({
      ordersId: options.ordersId,
      nickname: options.nickname
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
      key: 'isLogin',
      success: (res) => {
        this.setData({
          isLogin: res.data
        })
      },
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
  getFuckPartakeDetail:function(){
    wx.request({
      url: config.config.getFuckOperate,
      data: {
        token: this.data.token,
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean) {
            var couponList = res.data.bean
            var couponArr = []
            for (var i in couponList) {
              couponArr.push(couponList[i].id)
            }
            this.setData({
              couponArr: couponArr
            })
            console.log(couponArr)
            console.log(couponArr.toString())
          }
        } else if (res.data.status == 801){
          utils.getUserInfoFun(this.getFuckPartakeDetail, this)
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
  * 领取优惠券
  */
  getCoupon: function () {
    if (this.data.isLogin) {
      wx.request({
        url: config.config.postAddCoupon,
        data: {
          token: this.data.token,
          couponIds: this.data.couponArr
        },
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            wx.showToast({
              title: '领取成功!',
              icon: 'none'
            })
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.getCoupon, this)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: this.data.nickname + '邀请你一起参与吐槽赢大礼，快进来一起吐槽吧!',
      path: '/pages/activity/activity?ordersId=' + this.data.ordersId,
      imageUrl: 'https://image.prise.shop/images/2018/07/27/1532662233109304.png',
      success: (res) => {
        console.log("分享成功")
        this.getCoupon();
      },
    }
  }
})
// pages/couponList/couponList.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: []
  },
  /**
   * 获取优惠券列表
   */
  getUserCoupon: function () {
    wx.request({
      url: config.config.getUserCoupon,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean) {
            var couponList = res.data.bean
            this.setData({
              couponList: couponList
            })
            for (var i in couponList) {
              var stateDate = couponList[i].stateDate.substr(0,10)
              var endDate = couponList[i].endDate.substr(0, 10)
              stateDate = stateDate.replace(/-/g, ".")
              endDate = endDate.replace(/-/g, ".")
              this.setData({
                ['couponList[' + i + '].stateDate']: stateDate,   
                ['couponList[' + i + '].endDate']: endDate                             
              })
            }
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getUserCoupon, this)
        } else {
          wx.showToast({
            title: res.data.msh,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 点击优惠券
   */
  selectedTicket: function (e) {
    if (this.data.pageFrom == 1) {
      var index = e.currentTarget.dataset.index 
      if (this.data.couponList[index].isOverdue != 1) {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    } else {
      var index = e.currentTarget.dataset.index 
      var id = this.data.couponList[index].id
      console.log(id)
      wx.request({
        url: config.config.postUpdateCouponStatus,
        method: 'POST',
        data: {
          token: this.data.token,
          id: id,
          price: this.data.totalPrice
        },
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            console.log(res.data.bean)
            this.getUserCoupon()
            wx.navigateBack({
              delta: 1
            })
          } else if (res.data.status == 801){
            utils.getUserInfoFun(this.selectedTicket, this)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.pageFrom) {
      this.setData({
        pageFrom: options.pageFrom
      })
    } else {
      this.setData({
        totalPrice: options.totalPrice
      })
    }
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
        this.getUserCoupon()
      },
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
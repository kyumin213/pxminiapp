// pages/orderDetails/orderDetails.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({
  data: {
    ordersId: '',
    orderInfo: {},
    itemList: [],
    status: ["取消订单", "待付款", "待发货", "已发货", "提醒发货", "仅退款", "退货退款", "待评价", "已评价", "已退款"],
    statusTips: ["小派期待您的再次光临", "请在24小时内完成支付，过时订单将会取消", "小派正在精心为您准备礼物中","小派正在快马加鞭为您送礼物","","","",""]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    console.log(this.data.orderId)
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
        this.getOrderDetail()
      },
      fail: (res) => {
        utils.getUserInfoFun(this.getOrderDetail, this)        
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 获取订单详细信息
   */
  getOrderDetail: function () {
    wx.request({
      url: config.config.getOrderDetail,
      data: {
        token: this.data.token,
        ordersId: this.data.orderId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if(res.data.status == 200) {
          console.log(res.data.bean)
          var itemList = res.data.bean.itemList
          this.setData({
            orderInfo: res.data.bean,
            itemList: res.data.bean.itemList
          })
          var param = {}
          for (var i in itemList) {
            param.propName = JSON.parse(itemList[i].productParamText).propName
            param.price = JSON.parse(itemList[i].productParamText).price
            this.setData({
              ['itemList[' + i + '].productParamText']: param
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getOrderDetail, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  bindReceive: function () {
    var orderId = this.data.orderInfo.orders.id
    wx.request({
      url: config.config.postReceive,
      data: {
        ordersId: orderId,
        token: this.data.token
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (data) => {
        console.log(data)
        if (data.data.status == 200) {
          wx.navigateTo({
            url: '/pages/order/order?currentNavtab=3',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.bindReceive, this)
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
   * 微信支付
   */
  wxpay: function () {
    var orderId = this.data.orderInfo.orders.id
    var ordersPrice = this.data.orderInfo.orders.priceTotal
    wx.request({
      url: config.config.postOrderPay,
      method: 'POST',
      data: {
        token: this.data.token,
        ordersId: orderId,
        priceTotal: ordersPrice
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data.bean)
          wx.requestPayment({
            'timeStamp': res.data.bean.timeStamp,
            'nonceStr': res.data.bean.nonceStr,
            'package': res.data.bean.package,
            'signType': 'MD5',
            'paySign': res.data.bean.sign,
            'success': function (res) {
              wx.navigateTo({
                url: '/pages/payResult/payResult',
              })
            },
            'fail': function (res) {
              // wx.navigateTo({
              //   url: '/pages/order/order?currentNavtab=0',
              // })
            }
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.wxpay, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      } 
    })
  }
})
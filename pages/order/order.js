// pages/order/order.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navTab: [
      {
        topicName: '全部'
      },
      {
        topicName:'待付款'
      },
      {
        topicName: '待收货'
      },
      {
        topicName: '已完成'
      }      
    ],
    status: ["已取消", "待付款", "待发货", "已发货", "提醒发货", "仅退款", "退货退款", "已收货", "已评价","已退款"],
    beforePay:[],
    beforeReceive: [],
    completed: [],
    beforeAssess: [],
    refund: [],
    allOrder: [],
    // currentNavtab: 0,
    scrollLeft: 0, //tab标题的滚动条位置
    contentId: 0,
    winHeight: 0, 
    swiperHeight: 0,
    a: 1,
    b: 1,
    c: 1,
    d: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentNavtab: options.currentNavtab
    })
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
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
        this.getOrderListFun()
      },
      fail: (res) => {
        utils.getUserInfoFun(this.getOrderListFun, this)
      }
    })
  },
  getOrderListFun: function () {
    this.getOrderList('99', 1)
    this.getOrderList('0', 1)
    this.getOrderList('1', 1)
    this.getOrderList('2', 1)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.getOrderListFun()
    wx.stopPullDownRefresh()
  },
  /**
   * 确认收货
   */
  bindReceive: function (e) {
    var index = e.currentTarget.dataset.index
    var orderId = this.data.beforeReceive[index].orderId
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
          this.getOrderListFun()
        } else if (data.data.status == 801) {
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
   * 查看物流
   */
  bindLogiticts: function (e) {
    var index = e.currentTarget.dataset.index
    var orderId = this.data.beforeReceive[index].orderId
    wx.navigateTo({
      url: '/pages/logistics/logistics?ordersId=' + orderId,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentNavtab == 0) {
      // this.data.beforePaytotal > this.data.beforePay.length
      if (this.data.beforePay.length > 10 * this.data.a - 1) {
        ++this.data.a
        this.getOrderListRefresh('0', this.data.a)
      }
    } else if (this.data.currentNavtab == 1) {
      if (this.data.beforeReceive.length > 10 * this.data.b - 1) {
        ++this.data.b;
        this.getReceiveListRefresh('1', this.data.b)
      }
    } else if(this.data.currentNavtab == 2) {
      if (this.data.completed.length > 10 * this.data.c - 1) {
        ++this.data.c;
        this.getCompleteListRefresh('2', this.data.c)
      }
    } else if (this.data.currentNavtab == 3) {
      if (this.data.allOrder.length > 10 * this.data.d - 1) {
        ++this.data.d;
        this.getAllorderListRefresh('99', this.data.d)
      }
    }
  },

  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.currentTarget.dataset.index;
    // if (this.data.currentNavtab == cur) 
    // { return false; }
    // else {
      this.setData({
        currentNavtab: cur,
      })
    // }
  },
  bindChange:function(e){
    var that = this;  
    that.setData({
      currentNavtab: e.detail.current
    })
  },
  /**
   * 获取订单列表
   */
  getOrderList: function (status, pageBegin) {
    wx.request({
      url: config.config.getUserOrder,
      data: {
        token: this.data.token,
        status: status,
        pageBegin: pageBegin
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
        }
        if (res.data.status == 200 && status == 99) {
          var allOrder = res.data.bean || []
          // if (allOrder) {
            allOrder.sort(utils.compareDown("ordersCreated"))
            this.setData({
              allOrder: allOrder
            })
            var param = {}
            for (var i in allOrder) {
              for (var j in allOrder[i].itemVoList) {
                param.propName = JSON.parse(allOrder[i].itemVoList[j].productParamText).propName
                param.price = JSON.parse(allOrder[i].itemVoList[j].productParamText).price
                // 设置解析后的属性的值
                this.setData({
                  ['allOrder[' + i + '].itemVoList[' + j + '].productParamText']: param
                })
              }
            }
          // } 
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getOrderListFun, this)
        }
        if (res.data.status == 200 && status == 0) {
          var beforePay = res.data.bean || []
          // if (beforePay) {
            beforePay.sort(utils.compareDown("ordersCreated"))
            this.setData({
              beforePay: beforePay
            })
            var param = {}
            for (var i in beforePay) {
              for (var j in beforePay[i].itemVoList) {
                param.propName = JSON.parse(beforePay[i].itemVoList[j].productParamText).propName
                param.price = JSON.parse(beforePay[i].itemVoList[j].productParamText).price
                // 设置解析后的属性的值
                this.setData({
                  ['beforePay[' + i + '].itemVoList[' + j + '].productParamText']: param
                })
              }
            }
          // }  
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getOrderListFun, this)
        }
        if (res.data.status == 200 && status == 1) {
          var beforeReceive = res.data.bean || []
          // if (beforeReceive) {
            beforeReceive.sort(utils.compareDown("ordersCreated"))
            this.setData({
              beforeReceive: beforeReceive
            })
            var param = {}
            for (var i in beforeReceive) {
              for (var j in beforeReceive[i].itemVoList) {
                param.propName = JSON.parse(beforeReceive[i].itemVoList[j].productParamText).propName
                param.price = JSON.parse(beforeReceive[i].itemVoList[j].productParamText).price
                // 设置解析后的属性的值
                this.setData({
                  ['beforeReceive[' + i + '].itemVoList[' + j + '].productParamText']: param
                })
              }
            }
            console.log(this.data.beforeReceive)
          // }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getOrderListFun, this)
        }
        if (res.data.status == 200 && status == 2) {
          var completed = res.data.bean || []
          // if (completed) {
            completed.sort(utils.compareDown("ordersCreated"))
            this.setData({
              completed: completed
            })
            var param = {}
            for (var i in completed) {
              for (var j in completed[i].itemVoList) {
                param.propName = JSON.parse(completed[i].itemVoList[j].productParamText).propName
                param.price = JSON.parse(completed[i].itemVoList[j].productParamText).price
                // 设置解析后的属性的值
                this.setData({
                  ['completed[' + i + '].itemVoList[' + j + '].productParamText']: param
                })
              }
            }
          // }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getOrderListFun, this)
        }
      }
    })
  },
  /**
   * 下拉触底获取待付款列表
   */
  getOrderListRefresh: function (status, pageBegin) {
    wx.request({
      url: config.config.getUserOrder,
      data: {
        token: this.data.token,
        status: status,
        pageBegin: pageBegin
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200 && status == 0) {
          var len = this.data.beforePay.length
          console.log(len)
          var refreshBeforePay = res.data.bean
          if (res.data.bean) {
            refreshBeforePay.sort(utils.compareDown("ordersCreated"))
            var tempArray = this.data.beforePay
            tempArray = tempArray.concat(refreshBeforePay)
            this.setData({
              beforePay: tempArray
            })
            var param = {}
            for (var i in tempArray) {
              if (i > len-1) {
                for (var j in tempArray[i].itemVoList) {
                  param.propName = JSON.parse(tempArray[i].itemVoList[j].productParamText).propName
                  param.price = JSON.parse(tempArray[i].itemVoList[j].productParamText).price
                  // 设置解析后的属性的值
                  this.setData({
                    ['beforePay[' + i + '].itemVoList[' + j + '].productParamText']: param
                  })
                }
              }
            }
          }
        }
      }
    })
  },
  /**
   * 下拉触底获取待收货列表
   */
  getReceiveListRefresh: function (status, pageBegin) {
    wx.request({
      url: config.config.getUserOrder,
      data: {
        token: this.data.token,
        status: status,
        pageBegin: pageBegin
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200 && status == 1) {
          var len = this.data.beforeReceive.length
          console.log(len)
          var refreshBeforeReceive = res.data.bean
          if (res.data.bean) {
            refreshBeforeReceive.sort(utils.compareDown("ordersCreated"))
            var tempArray = this.data.beforeReceive
            tempArray = tempArray.concat(refreshBeforeReceive)
            this.setData({
              beforeReceive: tempArray
            })
            var param = {}
            for (var i in tempArray) {
              if (i > len-1) {
                for (var j in tempArray[i].itemVoList) {
                  param.propName = JSON.parse(tempArray[i].itemVoList[j].productParamText).propName
                  param.price = JSON.parse(tempArray[i].itemVoList[j].productParamText).price
                  // 设置解析后的属性的值
                  this.setData({
                    ['beforeReceive[' + i + '].itemVoList[' + j + '].productParamText']: param
                  })
                }
              }
            }
          }
        }
      }
    })
  },
  /**
   * 下拉触底获取已完成列表
   */
  getCompleteListRefresh: function (status, pageBegin) {
    wx.request({
      url: config.config.getUserOrder,
      data: {
        token: this.data.token,
        status: status,
        pageBegin: pageBegin
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200 && status == 2) {
          var len = this.data.completed.length
          console.log(len)
          var refreshCompleted = res.data.bean
          if (res.data.bean) {
            refreshCompleted.sort(utils.compareDown("ordersCreated"))
            var tempArray = this.data.completed
            tempArray = tempArray.concat(refreshCompleted)
            this.setData({
              completed: tempArray
            })
            var param = {}
            for (var i in tempArray) {
              if (i > len-1) {
                for (var j in tempArray[i].itemVoList) {
                  param.propName = JSON.parse(tempArray[i].itemVoList[j].productParamText).propName
                  param.price = JSON.parse(tempArray[i].itemVoList[j].productParamText).price
                  // 设置解析后的属性的值
                  this.setData({
                    ['completed[' + i + '].itemVoList[' + j + '].productParamText']: param
                  })
                }
              }
            }
          }
        }
      }
    })
  },
  /**
   * 下拉触底获取全部订单列表
   */
  getAllorderListRefresh: function (status, pageBegin) {
    wx.request({
      url: config.config.getUserOrder,
      data: {
        token: this.data.token,
        status: status,
        pageBegin: pageBegin
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200 && status == 99) {
          var len = this.data.allOrder.length
          var refreshAllOrder = res.data.bean
          if (res.data.bean) {
            refreshAllOrder.sort(utils.compareDown("ordersCreated"))
            var tempArray = this.data.allOrder
            tempArray = tempArray.concat(refreshAllOrder)
            this.setData({
              allOrder: tempArray
            })
            var param = {}
            for (var i in tempArray) {
              if (i > len-1) {
                for (var j in tempArray[i].itemVoList) {
                  param.propName = JSON.parse(tempArray[i].itemVoList[j].productParamText).propName
                  param.price = JSON.parse(tempArray[i].itemVoList[j].productParamText).price
                  // 设置解析后的属性的值
                  this.setData({
                    ['allOrder[' + i + '].itemVoList[' + j + '].productParamText']: param
                  })
                }
              }
            }
          }
        }
      }
    })
  },
  gotoPay: function (e) {
    var index = e.currentTarget.dataset.index
    var orderId = this.data.beforePay[index].orderId
    var ordersPrice = this.data.beforePay[index].ordersPrice
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
              // console.log('fail')
              // wx.navigateTo({
              //   url: '/pages/order/order?currentNavtab=0',
              // })
            }
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.gotoPay, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  gotoPayAll: function (e) {
    var index = e.currentTarget.dataset.index
    var orderId = this.data.allOrder[index].orderId
    var ordersPrice = this.data.allOrder[index].ordersPrice
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
              //   url: '/pages/order/order?currentNavtab=3',
              // })
            }
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.gotoPayAll, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  gotoDetail: function (e) {
    var index = e.currentTarget.dataset.index
    var orderId = this.data.beforePay[index].orderId
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?orderId=' + orderId,
    })
  },
  gotoDetailTwo: function (e) {
    var index = e.currentTarget.dataset.index
    var orderId = this.data.beforeReceive[index].orderId
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?orderId=' + orderId,
    })
  },
  gotoDetailThree: function (e) {
    var index = e.currentTarget.dataset.index
    var orderId = this.data.completed[index].orderId
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?orderId=' + orderId,
    })
  },
  gotoDetailAll: function (e) {
    var index = e.currentTarget.dataset.index
    var orderId = this.data.allOrder[index].orderId
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?orderId=' + orderId,
    })
  }
}) 
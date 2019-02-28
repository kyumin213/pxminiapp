// pages/special/special.js
const app = getApp()
var config = require("../../utils/config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title: '',
    specialBanner: '',
    banner: ["https://image.prise.shop/images/2018/04/12/1523518301145139.png"],
    goodsList: [],
    labelArr: [],
    isLoading: false,
    specialList: [],
    currentLabeltab: 0,
    specialName: [],
    toView: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sId: options.id,
    })
    if (app.globalData.token) {
      this.setData({
        token: app.globalData.token
      })
    }
    this.getSharePic()
  },
  /**
   * 获取抢购列表
   */
  getSecKillList: function () {
    wx.request({
      url: config.config.getSecKillList,
      data: {
        specialId: this.data.sId,
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        wx.stopPullDownRefresh()
        if(res.data.status == 200) {
          this.setData({
            goodsList: res.data.bean.specialProductVoList,
            seckillLefttime: res.data.bean.timeLeft,
            isLoading: true
          })
          if (this.data.seckillLefttime > 0) {
            var days = Math.floor(this.data.seckillLefttime / 60 / 60 / 24)
            var hours = this.addNumber(Math.floor(this.data.seckillLefttime / 60 / 60 % 24));
            var minutes = this.addNumber(Math.floor(this.data.seckillLefttime / 60 % 60));
            var seconds = this.addNumber(Math.floor(this.data.seckillLefttime % 60));
            this.setData({
              killdays: days,
              killhours: hours,
              killminutes: minutes,
              killseconds: seconds
            })
            // 开始倒计时
            this.countDownKill()
          } else {
            this.setData({
              killdays: 0,
              killhours: '00',
              killminutes: '00',
              killseconds: '00',
              isEnd: true
            })
          } 
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
   * 倒计时
   */
  countDownKill: function () {
    clearInterval(this.data.timerkill)
    this.data.timerkill = setInterval(() => {
      if (this.data.seckillLefttime > 0) {
        this.data.seckillLefttime--
        var days = Math.floor(this.data.seckillLefttime / 60 / 60 / 24)
        var hours = this.addNumber(Math.floor(this.data.seckillLefttime / 60 / 60 % 24));
        var minutes = this.addNumber(Math.floor(this.data.seckillLefttime / 60 % 60));
        var seconds = this.addNumber(Math.floor(this.data.seckillLefttime % 60));
        this.setData({
          killdays: days,
          killhours: hours,
          killminutes: minutes,
          killseconds: seconds
        })
      } else {
        this.setData({
          isEnd: true          
        })
      }
    }, 1000)
  },
  addNumber: function (num) {
    var num = (num > 9) ? num : ('0' + num);
    return num;
  },
  
  /**
   * 去秒杀详情
   */
  gotoSeckill: function (e) {
    var index = e.currentTarget.dataset.index
    var stock = this.data.goodsList[index].stock
    console.log(stock)
    var productId = this.data.goodsList[index].SpecialProduct.productId
    // if (stock > 0) {
      wx.navigateTo({
        url: '/pages/secKill/secKill?id=' + productId,
      })
    // }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.token) {
      this.setData({
        token: app.globalData.token
      })
    }
    this.getSecKillList()
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getSecKillList()
    this.getSharePic()
  },
  // 获取下期抢购时间
  getSharePic: function () {
    wx.request({
      url: config.config.getSharePic,
      data: {
        configKey: 'secKillNextTime',
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data.bean)
          this.setData({
            secKillNextTime: res.data.bean.configValue,
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: '/pages/secKillList/secKillList?id=' + this.data.sId,
    }
  },

  gotoDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.request({
      url: config.config.getProductDetails,
      data: {
        token: this.data.token,
        id: id
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var stock = res.data.bean.stock
          if (stock > 0) {
            wx.navigateTo({
              url: '/pages/productDetails/productDetails?id=' + id,
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
})
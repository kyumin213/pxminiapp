const app = getApp()
const utils = require('../../../utils/util.js')
var config = require('../../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wishes: [],
    currentIndex: null,
    isSelect: false,
    ordersText: ["一","二","三","四","五","六","七"],
    autoplay: true,
    circular: true,
    vertical: true,
    duration: 500,
    interval: 2000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isNew = options.isNew || false
    this.setData({
      isNew: isNew
    })
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
  
  /**
   * 选择愿望
   */
  selectWish: function (e) {
    if (!this.data.hasTree) {
      var index = e.currentTarget.dataset.index
      var promiseId = this.data.wishes[index].id
      // var wishName = '愿望' + this.data.ordersText[index]  
      var wishName = this.data.wishes[index].giftTitle 
      this.setData({
        isSelect: true,
        currentIndex: index,
        wishName: wishName,
        promiseId: promiseId
      })
    }    
  },
  /**
   * 提交已选愿望信息
   */
  submitWishInfo: function () {
    wx.request({
      url: config.config.postWishTree,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 
        token: this.data.token,
        promiseId: this.data.promiseId
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.navigateTo({
            url: '/packageA/pages/wishTree/wishTree?isNew=' + this.data.isNew,
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitWishInfo, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  gotoWishTree: function () {
    if (this.data.isSelect) {
      if (this.data.isLogin) {
        this.submitWishInfo()
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }      
    }
  },
  gotoMyTree: function () {
    wx.navigateTo({
      url: '/packageA/pages/wishTree/wishTree'
    })
  },
  /**
   * 获取愿望数据
   */
  getData: function () {
    wx.request({
      url: config.config.getWishesIndex,
      dataType:'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { token: this.data.token},
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          if (res.data.bean) {
            this.setData({
              wishes: res.data.bean.promiseList,
              MessageList: res.data.bean.promiseFinishList
            })
          }          
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从公众号过来 判断是否登录 若已登录查询是否有树 
    var isLogin = wx.getStorageSync("isLogin") || false
    this.setData({
      isLogin: isLogin,
      currentIndex: null
    }) 
    var token = wx.getStorageSync("token") || 'paixi_123'
    this.setData({
      token: token
    })
    // 获取愿望信息
    this.getData()    
    if (isLogin) {
      this.getUserStatus()
    } else {
      // 未登录设定为没有树
      this.setData({
        hasTree: false
      })
    }
  },
  /**
   * 判断用户种树状态 0：全新玩家；1：没有许愿树；2：有许愿树；3：有成熟的果实;4：已摘取；5：已脱落；
   */
  getUserStatus: function () {
    wx.request({
      url: config.config.getWishTreeStatus,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean == 0) {
            this.setData({
              isNew: true,
              hasTree: false
            })
          } else if (res.data.bean == 1 || res.data.bean == 4) {
            this.setData({
              hasTree: false,
              isNew: false
            })
          } else if (res.data.bean == 2 || res.data.bean == 3 || res.data.bean == 5) {
            this.setData({
              hasTree: true,
              isNew: false
            })
          }          
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getUserStatus, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData()
  },
  /**
   * 判断首次分享
   */
  isFirstTimeShare: function () {
    wx.request({
      url: config.config.postIsFirstTimeShare,
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: this.data.token
      },
      success: (res) => {
        if (res.data.status == 200) {

        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.isFirstTimeShare, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    this.isFirstTimeShare()
    return {
      title: '@你，听说在派喜的许愿树许愿，愿望就会成真喔~',
      path: '/packageA/pages/wishing/wishing',
      imageUrl: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20181129032025726920109.png'
    }
  }
})
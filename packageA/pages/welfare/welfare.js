// packageA/pages/welfare/welfare.js
const app = getApp()
const utils = require('../../../utils/util.js')
var config = require('../../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    btnTxt: ["未完成","领取奖励","已领取"]
  },
  bindSwitch: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      current: index
    })
    if (index == 1) {
      this.getDailyTask()
    } else {
      this.getPeriodTask()      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      current: options.current || 1
    })
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.toLowerCase().indexOf('iphone x') > -1) {
          this.setData({
            iphonex: true
          })
        }
      }
    })
  },
  /**
   * 获取每日福利
   */
  getDailyTask: function () {
    utils.httpRequestGet(config.config.getDailyTask, {token: this.data.token}, (res) => {
      wx.stopPullDownRefresh()
      if (res.data.status == 200) {
        this.setData({
          dailyTask: res.data.bean
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getDailyTask, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 获取成长福利
   */
  getPeriodTask: function () {
    utils.httpRequestGet(config.config.getPeriodTask, { token: this.data.token }, (res) => {
      if (res.data.status == 200) {
        this.setData({
          periodTask: res.data.bean
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getPeriodTask, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 领取成长福利奖励
   */
  bindClickPeriodReward: function (e) {
    var index = e.currentTarget.dataset.index
    var topicId = this.data.periodTask[index].id
    var taskStatus = this.data.periodTask[index].taskStatus
    var growthValue = this.data.periodTask[index].growthValue
    this.setData({
      growthValue: growthValue
    })
    if (taskStatus == 1) {
      utils.httpRequestPost(config.config.getTaskRewards, { token: this.data.token, topicId: topicId }, (res) => {
        if (res.data.status == 200) {
          // 判断是能量还是时间卡
          if (res.data.bean == 0) {
            this.setData({
              showEnergyTool: true
            })
          } else if (res.data.bean == 1) {
            this.setData({
              showTimeTool: true
            })
          } else if (res.data.bean == 2) {
            this.setData({
              showMoneyTool: true
            })
          }   
          this.getPeriodTask()      
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.bindClickPeriodReward, this)
        } else {
          utils.showTips(res.data.msg)
        }
      })
    }    
  },
  /**
   * 关闭时间卡道具
   */
  closeTimeTool: function () {
    this.setData({
      showTimeTool: false
    })
  },
  closeMoneyTool: function () {
    this.setData({
      showMoneyTool: false
    })
  },
  /**
   * 领取每日福利奖励
   */
  bindClickDailyReward: function (e) {    
    var index = e.currentTarget.dataset.index    
    var topicId = this.data.dailyTask[index].id
    var taskStatus = this.data.dailyTask[index].taskStatus
    var growthValue = this.data.dailyTask[index].growthValue
    this.setData({
      growthValue: growthValue
    })
    if (taskStatus == 1) {
      utils.httpRequestPost(config.config.getTaskRewards, { token: this.data.token, topicId: topicId }, (res) => {
        if (res.data.status == 200) {
          // 判断是能量还是时间卡
          if (res.data.bean == 0) {
            this.setData({
              showEnergyTool: true
            })
          } else if (res.data.bean == 1) {
             this.setData({
               showTimeTool: true
             })
          } else if (res.data.bean == 2) {
            this.setData({
              showMoneyTool: true
            })
          } 
          this.getDailyTask()        
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.bindClickDailyReward, this)
        } else {
          utils.showTips(res.data.msg)
        }
      })   
    }     
  },
  closeEnergyTool: function () {
    this.setData({
      showEnergyTool: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu()    
    var token = wx.getStorageSync("token") || 'paixi_123'
    this.setData({
      token: token
    })
    this.getDailyTask()
    this.getPeriodTask() 
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
    // wx.stopPullDownRefresh()
    this.setData({
      current: 1
    })
    this.getDailyTask()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
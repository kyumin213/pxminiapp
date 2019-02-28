// pages/feedback/feedback.js
var config = require('../../utils/config.js')
var common = require('../../utils/commonRequest.js');
const utils = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbackData: '',
    contact: ''
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
      },
      fail: (res) => {
        utils.getUserInfoFun(this.onShow, this)
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  getFeedback: function (e) {
    var that = this;
    that.setData({
      feedbackData: e.detail.value
    })
    console.log(that.data.feedbackData)
  },

  getContact:function(e){
    var that = this;
    that.setData({
      contact: e.detail.value
    })
    console.log(e.detail.value);
  },

  getSubmit:function(){
    wx.request({
      url: config.config.getFeedback, 
      data: {
        token: this.data.token,
        content: this.data.feedbackData,
        contact: this.data.contact
      },
      method:'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              },500)         
            }
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getSubmit)
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
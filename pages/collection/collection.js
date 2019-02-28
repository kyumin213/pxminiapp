// pages/collection/collection.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[ ]
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
        this.getCollect()
      },
      fail: (res) => {
        // this.getUserInfoFun(this.getCollect)
        utils.getUserInfoFun(this.getCollect, this)
      }
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCollect()
  },

  getCollect: function () {
    wx.request({
      url: config.config.getCollectList,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          console.log(res.data.bean)
          var collectList = res.data.bean
          this.setData({
            collectList: collectList
          })
          for (var i in collectList) {
            if (collectList[i].status == 0) {
              this.setData({
                ['collectList[' + i +'].classname']: 'off'
              })
            } else if (collectList[i].status == 1) {
              this.setData({
                ['collectList[' + i + '].classname']: ''
              })
            }
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getCollect, this)          
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
    var id = this.data.collectList[index].id
    console.log(id)
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' + id,
    })
  }
})
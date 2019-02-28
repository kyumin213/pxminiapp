const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNavtab: 0,
    categoryName: [],
    gallery: []
  },
  swichNav: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentNavtab: index
    })
    var classifyId = this.data.categoryName[index].id
    this.getGallery(classifyId)
  },
  confirmPicture: function (e) {
    var index = e.currentTarget.dataset.index
    var selectedImg = this.data.gallery[index].imageUrl
    wx.reLaunch({
      url: '/pages/gifts/gifts?selectedImg=' + selectedImg,
    })
  },
  getCategory: function () {
    wx.request({
      url: config.config.getGalleryCategory,
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
          var categoryName = res.data.bean
          this.setData({
            categoryName: categoryName
          })
          var classifyId = this.data.categoryName[this.data.currentNavtab].id
          this.getGallery(classifyId)
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getGallery, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  getGallery: function (classifyId) {
    wx.request({
      url: config.config.getGallery,
      data: {
        token: this.data.token,
        classifyId: classifyId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data.bean)
          if (res.data.bean) {
            var gallery = res.data.bean
            this.setData({
              gallery: gallery
            })
          } else {
            this.setData({
              gallery: []
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (res.data) {
          this.setData({
            token: res.data
          })
        }
        this.getCategory()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getCategory()
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCategory()
  },
})
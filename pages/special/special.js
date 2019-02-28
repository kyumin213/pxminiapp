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
    goodsList:[],
    labelArr: [],
    isLoading: false,
    specialList: [],
    currentLabeltab: 0,
    specialName: [],
    toView: '',
    isLazy: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sId: options.id,
      title: options.title,
      // specialBanner: options.specialBanner
    })
    if (app.globalData.token) {
      this.setData({
        token: app.globalData.token
      })
    }
    this.getAllLabel()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#F72F2B',
    })
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.toLowerCase().indexOf('iphone x') > -1) {
          console.log('xx')
          this.setData({
            iphonex: true
          })
        }
      },
    })
    // this.getAllSpecialInfo()
    // this.getSpecialList(this.data.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
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
  },
  /**
   * 切换导航
   */
  swichNav: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentNavtab: index,
      currentLabeltab: 0
    })
    var sId = this.data.specialName[index].id
    var sTitleArr = this.data.specialName[index].name
    if (sTitleArr.length > 1) {
      var sTitle = sTitleArr[1]
    } else {
      var sTitle = sTitleArr[0]
    }
    this.setData({
      sId: sId,
      specialBanner: this.data.specialName[index].pictureBanner,
      title: sTitle
    })
    wx.setNavigationBarTitle({
      title: sTitle
    })
    this.getAllLabel()
  },
  /**
   * 切换标签
   */
  swichLabel: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentLabeltab: index
    })
    this.getAllLabel()
  },
  /**
   * 获取所有专题分类
   */
  getAllSpecialInfo: function () {
    this.setData({
      showNav: false
    })
    wx.showNavigationBarLoading()
    wx.request({
      url: config.config.getAllSpecial,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var specialName = res.data.bean
          this.setData({
            specialName: specialName
          })
          var sId = this.data.sId 
          // var sId = specialName[0].id
          var name = []         
          for (var i in specialName) {
            name = specialName[i].name.split('+')
            this.setData({
              ['specialName['+i+'].name']: name
            })
            if (specialName[i].id == sId) {
              this.setData({
                sId: specialName[i].id,
                currentNavtab: i,
                toView: 'name' + i
              })
            }
          }
          setTimeout(()=>{
            this.setData({
              showNav: true
            })
          },50)          
          // var sId = this.data.specialName[this.data.currentNavtab].id
          this.getSpecialList(this.data.sId, this.data.labelArr[this.data.currentLabeltab].id)
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
   * 获取所有标签
   */
  getAllLabel: function () {
    wx.request({
      url: config.config.getAllSpecialLabel,
      data: {
        token: this.data.token,
        specialId: this.data.sId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            labelArr: res.data.bean
          })
          // 获取专题分类
          this.getAllSpecialInfo()
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
   * 获取专题商品列表  sId：专题id  id：标签ID
   */
  getSpecialList: function (sId, id) {
    wx.request({
      url: config.config.getSpecial,
      data: {
        token: this.data.token,
        sId: sId,
        id: id
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading()
          if (res.data.bean) {
            var specialList = res.data.bean
            // var goodsList = res.data.bean
            this.setData({
              // goodsList: goodsList,
              isLoading: true,
              specialList: specialList
            })
            for (var i in specialList) {
              if (specialList[i].label) {
                this.setData({
                  ['specialList[' + i + '].label']: specialList[i].label.split("-")
                })
              } else {
                this.setData({
                  ['specialList[' + i + '].label']: []
                })
              }

              for (var j in specialList[i].productSpecialVos) {
                if (specialList[i].productSpecialVos[j].stock == 0) {
                  this.setData({
                    ['specialList[' + i + '].productSpecialVos[' + j + '].styleStatus']: 'gray',
                    ['specialList[' + i + '].productSpecialVos[' + j + '].canClick']: false
                  })
                } else {
                  this.setData({
                    ['specialList[' + i + '].productSpecialVos[' + j + '].styleStatus']: '',
                    ['specialList[' + i + '].productSpecialVos[' + j + '].canClick']: true
                  })
                }
              }
            }
          } else {
            this.setData({
              specialList: []
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
  // 下拉刷新获取第一个sId
  getFirstSpecialInfo: function () {
    wx.request({
      url: config.config.getAllSpecial,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var specialName = res.data.bean
          var sId = specialName[0].id
          this.setData({
            sId: sId
          })
          this.getAllLabel()
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.getAllLabel()
    this.getFirstSpecialInfo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: '/pages/special/special?id=' + this.data.sId + '&title=' + this.data.title + '&specialBanner=' + this.data.specialBanner,
      imageUrl: this.data.specialBanner,
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
    // todo 判断是否售罄
    // if (this.data.goodsList[index].canClick == true) {
    // wx.navigateTo({
    //   url: '/pages/productDetails/productDetails?id=' + id,
    // })
    // }
  }
})
// packageA/pages/rankList/rankList.js
const app = getApp()
const utils = require('../../../utils/util.js')
const config = require('../../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#A7C666',
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
  gotoRewards: function () {
    wx.navigateTo({
      url: '/packageA/pages/rewards/rewards',
    })
  },
  gobackRank: function () {
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '/packageA/pages/rankList/rankList',
    // })
  },
  /**
   * 获取本期榜单
   */
  getLastRank: function () {
    utils.httpRequestGet(config.config.getLastRank, { token: this.data.token }, (res) => {
      wx.stopPullDownRefresh()
      this.setData({
        isloading: true
      })
      if (res.data.status == 200) {
        this.setData({
          rankList: res.data.bean.lastList,
          rankRewardTakeWait: res.data.bean.rankRewardTakeWait
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getLastRank, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  // 领取奖励
  bindClickGetReward: function () {
    if (this.data.isLogin) {
      if (this.data.rankRewardTakeWait) {
        this.judgeRewardInfo()
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }    
  },
  /**
   *  判断是实物奖励还是能量奖励
   *  0:能量奖励 1:有实物奖励
   */
  judgeRewardInfo: function () {
    utils.httpRequestGet(config.config.getRankWinnerInfo, { token: this.data.token }, (res) => {
      if (res.data.status == 200) {
        if (res.data.bean == 0) {
          //  调用领取能量接口
          this.submitRankEnergy()
        } else {
          // 填写地址
          this.getRankGifts()
        }
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.judgeRewardInfo, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 排行榜能量奖励 领取
   */
  submitRankEnergy: function () {
    utils.httpRequestPost(config.config.postRankWinnerEnergy, { token: this.data.token }, (res) => {
      if (res.data.status == 200) {
        wx.navigateTo({
          url: '/packageA/pages/wishTree/wishTree',
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.submitRankEnergy, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 排行榜中奖 填写地址直接弹出微信默认地址
   */
  getRankGifts: function () {
    var _this = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              console.log('success')
            },
            fail() {
              utils.showModelStr('友情提示', '您点击了拒绝授权，将无法获取地址信息，点击确定重新获取授权', '确定', '取消', (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      console.log(res)
                      if (res.authSetting["scope.address"]) {
                        // this.addAddress()
                      }
                    }
                  })
                } else {
                  console.log('用户点击取消')
                }
              })
            }
          })
        } else {
          if (_this.data.hasAddress) {
            // 有地址 则调用修改接口
            wx.chooseAddress({
              success: (res) => {
                _this.setData({
                  addressInfo: res,
                  hasAddress: true
                })
                _this.setData({
                  addressDetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                  userphone: res.telNumber,
                  username: res.userName
                })
                wx.request({
                  url: config.config.postModifyAddress,
                  method: 'POST',
                  data: {
                    token: _this.data.token,
                    receiver: _this.data.addressInfo.userName,
                    phone: _this.data.addressInfo.telNumber,
                    province: _this.data.addressInfo.provinceName,
                    city: _this.data.addressInfo.cityName,
                    district: _this.data.addressInfo.countyName,
                    detailed: _this.data.addressInfo.detailInfo,
                    longitude: '',
                    latitude: '',
                    location: '',
                    isDefault: 1,
                    id: _this.data.addressId
                  },
                  dataType: 'json',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: (res) => {
                    console.log(res.data)
                    if (res.data.status == 200) {
                      // 修改成功弹出地址
                      utils.showModelStr('确认收件信息', _this.data.username + ',' + _this.data.userphone + ',' + _this.data.addressDetail, '确认地址', '返回修改', (res) => {
                        if (res.confirm) {
                          _this.submitRankWinnerAddress()
                        } else {
                          console.log('用户点击返回修改')
                          _this.getRankGifts()
                        }
                      })
                    } else if (res.data.status == 801) {
                      utils.getUserInfoFun(_this.getRankGifts, _this)
                    } else {
                      utils.showTips(res.data.msg)
                    }
                  }
                })
              },
            })
          } else {
            wx.chooseAddress({
              success: (res) => {
                _this.setData({
                  addressInfo: res,
                  hasAddress: true,
                  addressDetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                  userphone: res.telNumber,
                  username: res.userName
                })
                console.log(_this.data.addressInfo)
                wx.request({
                  url: config.config.postAddaddress,
                  method: 'POST',
                  data: {
                    token: _this.data.token,
                    receiver: _this.data.addressInfo.userName,
                    phone: _this.data.addressInfo.telNumber,
                    province: _this.data.addressInfo.provinceName,
                    city: _this.data.addressInfo.cityName,
                    district: _this.data.addressInfo.countyName,
                    detailed: _this.data.addressInfo.detailInfo,
                    longitude: '',
                    latitude: '',
                    location: ''
                  },
                  dataType: 'json',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: (res) => {
                    console.log(res.data)
                    if (res.data.status == 200) {
                      var id = res.data.bean.id
                      _this.setData({
                        ['addressInfo.id']: id,
                        addressId: id
                      })
                      // 修改成功弹出地址
                      utils.showModelStr('确认收件信息', _this.data.username + ',' + _this.data.userphone + ',' + _this.data.addressDetail, '确认地址', '返回修改', (res) => {
                        if (res.confirm) {
                          _this.submitRankWinnerAddress()
                        } else {
                          console.log('用户点击返回修改')
                          _this.getRankGifts()
                        }
                      })
                    } else if (res.data.status == 801) {
                      utils.getUserInfoFun(_this.getRankGifts, _this)
                    } else {
                      utils.showTips(res.data.msg)
                    }
                  }
                })
              },
            })
          }
        }
      }
    })
  },
  /**
   * 排行榜中奖提交地址接口
   */
  submitRankWinnerAddress: function () {
    wx.request({
      url: config.config.postRankWinnerAddress,
      method: 'POST',
      data: {
        token: this.data.token,
        treeId: this.data.treeId,
        addressId: this.data.addressId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.reLaunch({
            url: '/packageA/pages/rankSuccess/rankSuccess',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitRankWinnerAddress, this)
        } else if (res.data.status == 503) {
          utils.showTips(res.data.msg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu()
    var isLogin = wx.getStorageSync("isLogin") || false
    var token = wx.getStorageSync("token") || 'paixi_123'
    this.setData({
      token: token,
      isLogin: isLogin
    })
    this.getLastRank()
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
    this.getLastRank()
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
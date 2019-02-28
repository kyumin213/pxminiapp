// pages/openBox/openBox.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keysNumber: [],
    priseIndex: null,
    hasAddress: false,
    giftstatus: 1,
    keysTotal: null,
    hasChance: true,
    username: '',
    userphone: '',
    addressDetail: '',
    // assistanceStatus: 1,
    // isShowAssis: true
  },
  /**
   * 判断是否可以助力
   */
  getCanAssistant: function () {
    wx.request({
      url: config.config.getCanAssistant,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        shareUserId: this.data.shareUserId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // 调用助力接口
          // this.assistant()
          this.setData({
            assistanceStatus: 1,
            isShowAssis: true
          })
        } else if (res.data.status == 201) {
          // 不可以给自己助力，关闭助力弹框
          this.setData({
            isShowAssis: false
          })
        } else if (res.data.status == 202) {
          // 活动已结束 关闭助力弹框
          this.setData({
            isShowAssis: false
          })
        } else if (res.data.status == 203) {
          // 好友助力机会已用完
          this.setData({
            isShowAssis: false
          })
          // this.setData({
          //   assistanceStatus: 3,
          //   isShowAssis: true
          // })
        } else if (res.data.status == 204) {
          this.setData({
            isShowAssis: false
          })
          // 已经给好友助力过
          // this.setData({
          //   assistanceStatus: 2,
          //   isShowAssis: true
          // })
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.getCanAssistant)
          utils.getUserInfoFun(this.getCanAssistant, this)
        }
      }
    })
  },
  /**
   * 助力
   */
  assistant: function () {
    wx.request({
      url: config.config.postAssistant,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        shareUserId: this.data.shareUserId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data)
          // 助力成功动画
          this.setData({
            countstyle: 'display: block'
          })
          setTimeout(() => {
            this.setData({
              countstyle: 'display: none',
              assistanceStatus: 2
            })
          }, 800)
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.assistant)
          utils.getUserInfoFun(this.assistant, this)
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
   * 点击助力
   */
  addChance: function () {
    // 判断是否登录
    if (this.data.isLogin) {
      this.assistant()
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 助力弹框显示切换
   */
  toggleAssisDialog: function () {
    this.setData({
      isShowAssis: false
    })
  },
  /**
   * 监听输入姓名 
   */
  bindNameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  /**
   * 监听输入手机号 
   */
  bindPhoneInput: function (e) {
    this.setData({
      userphone: e.detail.value
    })
  },
  /**
   * 监听输入详细地址
   */
  bindAddressInput: function (e) {
    this.setData({
      addressDetail: e.detail.value
    })
  },
  /**
   * 获取用户默认地址
   */
  getUserAddress: function () {
    wx.request({
      url: config.config.getUserDefaultAddress,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean) {
            this.setData({
              addressId: res.data.bean.id,
              addressDetail: res.data.bean.location,
              userphone: res.data.bean.phone,
              username: res.data.bean.receiver,
              hasAddress: true
            })
          }
        } else {
          this.setData({
            hasAddress: false
          })
        }
      }
    })
  },
  /**
   * 开箱子成功之后点击领取 弹出填地址框
   */
  openAddress: function () {
    // 关闭动画
    this.setData({
      showSuccess: 'display:none',
      showRotate: 'display:none'
    })
    // 获取地址信息 打开地址弹窗
    this.getUserAddress()
    this.setData({
      openResult: 1
    })
  },
  /**
   * 开箱子
   */
  openBox: function (e) {
    if (this.data.isLogin) {
      // 机会大于0 并且 活动未结束才能开箱
      if (this.data.status == 0) {
        if (this.data.chances > 0) {
          var random = Math.random() * 16
          var priseIndex = Math.floor(random)
          this.setData({
            priseIndex: priseIndex
          })
          console.log(priseIndex)
          var index = e.currentTarget.dataset.index
          if (index == priseIndex) {
            // 调用抽奖接口 减抽奖次数
            this.lotteryFun()
            // 显示开奖成功动画
            this.setData({
              showSuccess: 'display:block',
              showSuccessImg: 'display:block',
            })
            setTimeout(() => {
              this.setData({
                showRotate: 'display:block',
                showSuccessImg: 'display:none'
              })
            }, 2200)
            // 中奖 获取是否有地址 打开地址弹框
            // this.getUserAddress()
            // this.setData({
            //   openResult: 1
            // })
          } else {
            // 调用抽奖接口 减抽奖次数
            this.lotteryFun()
            // 显示开奖失败动画及弹框
            this.setData({
              showFail: 'display:block',
              showFailImg: 'display:block'
            })
            setTimeout(() => {
              this.setData({
                showFail: 'display:none',
                showFailImg: 'display:none'
              })
              this.setData({
                openResult: 2
              })
            }, 2200)
          }
        } else {
          // 显示抽奖失败弹框
          this.setData({
            openResult: 2,
            failTip: true
          })
          if (this.data.shares == 0) {
            this.setData({
              noShares: true
            })
          }
        }
      } else {
        wx.showToast({
          title: '活动已结束',
          icon: 'none'
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 抽奖
   */
  lotteryFun: function () {
    wx.request({
      url: config.config.postJoinOpenBox,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            chances: res.data.bean.chances,
            shares: res.data.bean.shares,
            userId: res.data.bean.userId
          })
          if (this.data.shares == 0) {
            this.setData({
              noShares: true
            })
          }
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.lotteryFun)
          utils.getUserInfoFun(this.lotteryFun, this)
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
   * 切换开箱失败框
   */
  toggleFailDialog: function () {
    this.setData({
      openResult: ''
    })
  },
  /**
   * 切换开箱成功框
   */
  toggleSuccessDialog: function () {
    // 未确认地址则提示
    wx.showModal({
      title: '提示',
      content: '关闭将视为放弃领取礼物哦~',
      cancelText: '放弃领取',
      confirmText: '继续填写',
      success: (res) => {
        if (res.cancel) {
          this.setData({
            openResult: ''
          })
        }
      }
    })
  },
  /**
   * 提交中奖信息
   */
  addWinnerAddress: function () {
    wx.request({
      url: config.config.postBoxWinner,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        addressId: this.data.addressId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.showToast({
            title: '领取成功!'
          })
          this.setData({
            openResult: ''
          })
          // 中奖之后刷新页面信息
          this.getBoxCard()
        } if (res.data.status == 801) {
          utils.getUserInfoFun(this.addWinnerAddress, this)
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
   * 确认地址
   */
  confirmAddress: function () {
    var userphone = this.data.userphone
    var re = /^1\d{10}$/
    if (this.data.username == '') {
      wx.showToast({
        title: '请输入收礼人姓名',
        icon: 'none'
      })
    } else if (this.data.userphone == '') {
      wx.showToast({
        title: '请输入收礼人手机号',
        icon: 'none'
      })
    } else if (!re.test(userphone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
    } else if (this.data.addressDetail == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    } else if (this.data.addressDetail.length < 8) {
      wx.showToast({
        title: '请输入正确的地址',
        icon: 'none'
      })
    } else {
      wx.request({
        url: config.config.postAddaddress,
        method: 'POST',
        data: {
          token: this.data.token,
          receiver: this.data.username,
          phone: this.data.userphone,
          province: '',
          city: '',
          district: '',
          detailed: '',
          longitude: '',
          latitude: '',
          location: this.data.addressDetail
        },
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.status == 200) {
            var id = res.data.bean.id
            this.setData({
              addressId: id
            })
            this.addWinnerAddress()
          } else if (res.data.status == 801) {
            // this.getUserInfoFun(this.confirmAddress)
            utils.getUserInfoFun(this.confirmAddress, this)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },
  /**
   * 修改地址
   */
  modifyAddress: function () {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          addressInfo: res,
          hasAddress: true
        })
        console.log(this.data.addressInfo)
        this.setData({
          addressDetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          userphone: res.telNumber,
          username: res.userName
        })
        wx.request({
          url: config.config.postAddaddress,
          method: 'POST',
          data: {
            token: this.data.token,
            receiver: this.data.addressInfo.userName,
            phone: this.data.addressInfo.telNumber,
            province: this.data.addressInfo.provinceName,
            city: this.data.addressInfo.cityName,
            district: this.data.addressInfo.countyName,
            detailed: this.data.addressInfo.detailInfo,
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
              this.setData({
                addressId: id
              })
            } else if (res.data.status == 801) {
              // this.getUserInfoFun(this.modifyAddress)
              utils.getUserInfoFun(this.modifyAddress, this)
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },

  gotoIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  gotoGift: function () {
    wx.reLaunch({
      url: '/pages/gifts/gifts',
    })
  },
  /**
   * 分享助力
   */
  shareHelp: function () {
    // 分享助力的时候用自动的ID userId  shareUserId是参数传递过来的
    wx.navigateTo({
      url: '/pages/assistance/assistance?ordersId=' + this.data.ordersId + '&shareUserId=' + this.data.userId,
    })
  },
  /**
   * 获取抽奖情况
   */
  getBoxCard: function () {
    wx.request({
      url: config.config.getBoxCardInfo,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // 停止刷新
          wx.stopPullDownRefresh()
          if (res.data.bean) {
            // var userId = res.data.bean.ordersUserChanceVo.userId
            var ordersUserChanceVo = res.data.bean.ordersUserChanceVo
            if (ordersUserChanceVo == "") {
              this.setData({
                chances: res.data.bean.chances,
                shares: res.data.bean.shares
              })
            } else {
              this.setData({
                chances: res.data.bean.ordersUserChanceVo.chances,
                shares: res.data.bean.ordersUserChanceVo.shares,
                userId: res.data.bean.ordersUserChanceVo.userId
              })
            }
            var itemList = res.data.bean.ordersView.itemVoList
            if (itemList.length > 2) {
              this.setData({
                isShowMore: true
              })
            }
            var itemlistsub = itemList.splice(0, 2)
            var userReceiver = res.data.bean.ordersView.userReceiver ? res.data.bean.ordersView.userReceiver : ""
            this.setData({
              ordersItemNum: res.data.bean.ordersView.ordersItemNum,
              deadline: res.data.bean.ordersView.deadline,
              status: res.data.bean.ordersView.giftStatus,
              itemList: itemlistsub,
              userMaker: res.data.bean.ordersView.userMaker,
              userReceiver: userReceiver,
              keysTotal: res.data.bean.keys
            })
            var param = {}
            for (var i in itemlistsub) {
              param.propName = JSON.parse(itemlistsub[i].productParamText).propName
              this.setData({
                ['itemList[' + i + '].productParamText']: param
              })
            }
            for (var i = 0; i < this.data.keysTotal; i++) {
              this.setData({
                ['keysNumber[' + i + ']']: i + 1
              })
            }
            console.log(this.data.keysNumber)
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
  showAllItem: function () {
    // this.setData({
    //   isShowMore: false
    // })
    wx.request({
      url: config.config.getBoxCardInfo,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean) {
            var itemList = res.data.bean.ordersView.itemVoList
            this.setData({
              heightstyle: 200 * itemList.length + 'rpx',
              isShowMore: false
            })
            this.setData({
              ordersItemNum: res.data.bean.ordersView.ordersItemNum,
              status: res.data.bean.ordersView.giftStatus,
              itemList: itemList,
              userMaker: res.data.bean.ordersView.userMaker
            })
            var param = {}
            for (var i in itemList) {
              param.propName = JSON.parse(itemList[i].productParamText).propName
              this.setData({
                ['itemList[' + i + '].productParamText']: param
              })
            }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ordersId: options.ordersId,
      shareUserId: options.shareUserId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        console.log(res.data)
        this.setData({
          isLogin: res.data
        })
      },
      fail: (res) => {
        this.setData({
          isLogin: false
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        this.getBoxCard()
        // 调用 判读是否助力过接口
        this.getCanAssistant()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getBoxCard()
        // 显示助力弹框
        this.setData({
          assistanceStatus: 1,
          isShowAssis: true
        })
      }
    })
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
    this.getBoxCard()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    wx.request({
      url: config.config.postShareNumber,
      data: {
        ordersId: this.data.ordersId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log('点击分享了')
        }
      }
    })
    return {
      title: '我与大奖的距离，只差你的一步助力！',
      path: '/pages/assistance/assistance?ordersId=' + this.data.ordersId + '&shareUserId=' + this.data.userId,
      imageUrl: 'https://image.prise.shop/images/2018/06/14/1528941079993236.png',
    }
  }
})

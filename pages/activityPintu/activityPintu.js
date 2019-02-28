// pages/pintuGame/pintuGame.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
const Puzzle = require("../../utils/h5puzzle.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranklist: [],
    gameTime: 0,
    gameTimer: null,
    countDownTime: 5,
    countTimer: null,
    imgUrl: '',
    gameOver: false,
    totalTime: null,
    noChance: false,
    minutes: '00',
    seconds: '00',
    mins: '00',
    countClick: 0,
    userBingoList: [],
    showTips: true,
    hidetip: true,
    defaultPage: 1
  },
  /**
   * 排行榜触底事件
   */
  lower: function (e) {
    console.log(e)
    if (this.data.total > this.data.userPartake.length) {
      ++this.data.defaultPage
      this.setData({
        defaultPage: this.data.defaultPage
      })
      this.scrollRankList(this.data.defaultPage)
    }
  },
  /**
   * 上滑加载排行榜数据
   */
  scrollRankList: function (pageBegin) {
    wx.request({
      url: config.config.getRankListPintu,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        pageBegin: pageBegin
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var scrollUserPartake = res.data.bean.userPartake
          var tempArray = this.data.userPartake
          tempArray = tempArray.concat(scrollUserPartake)
          this.setData({
            userPartake: tempArray
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.scrollRankList, this)
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
   * 拼图 点击开始挑战 游戏开始
   */
  startGame: function (e) {
    if (this.data.isLogin) {
      this.setData({
        countClick: 0,
        minutes: '00',
        seconds: '00'
      })
      if (this.data.status == 0) {
        console.log("formId:" + e.detail.formId)
        this.setData({
          formId: e.detail.formId
        })
        // todo 检测是否还有挑战机会 没有的话弹框
        if (this.data.chances > 0) {
          this.joinGame()
          this.setData({
            isStarted: true
          })
          // 拼图初始化 this.data.keysTotal
          new Puzzle(this, {
            type: this.data.keysTotal
          });
          setTimeout(() => {
            // 清除打乱顺序定时器
            // clearInterval(timer)
            // 开始计时 两个计时器
            // var gameTime = 0
            this.submitTime()
            clearInterval(this.data.gameTimer)
            this.changeTime(0)
          }, 1600)
        } else {
          // 显示失败弹框
          this.setData({
            noChance: true
          })
        }
      } else {
        wx.showToast({
          title: '活动已结束！',
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
   * 查看原图
   */
  checkDefaultImg: function () {
    // 每加20s次数加1
    this.data.countClick++
    console.log(this.data.countClick)
    // 加20s 清除原来的定时器 重新开始计时
    // var gameTime = this.data.gameTime + 20000
    var gameTime = this.data.gameTime + 20
    this.setData({
      gameTime: gameTime
    })
    // 加20s后开始计时
    clearInterval(this.data.gameTimer)
    this.changeTime(gameTime)
    // 隐藏拼图 显示原图片
    this.setData({
      isCheakDefault: true,
      isStarted: false
    })
    var countDownTime = 5
    clearInterval(this.data.countTimer)
    this.data.countTimer = setInterval(() => {
      if (countDownTime > 0) {
        countDownTime--
      }
      this.setData({
        countDownTime: countDownTime
      })
    }, 1000)
    setTimeout(() => {
      clearInterval(this.data.countTimer)
      this.setData({
        countDownTime: 5,
        isCheakDefault: false,
        isStarted: true
      })
    }, 6000)
  },
  /**
   * 提交时间的计时
   */
  submitTime: function () {
    var date = new Date()
    var startTime = date.getTime()
    // 毫秒计时
    var misTimer = setInterval(() => {
      if (this.data.gameOver) {
        var date = new Date()
        var endTime = date.getTime()
        // 查看原图耗时
        var addTime = this.data.countClick * 20000
        var totalTime = endTime - startTime + addTime - 1000
        var mm = this.addNumber(parseInt((totalTime % (1000 * 60 * 60)) / (1000 * 60)))
        var ss = this.sliptNumber(totalTime % (1000 * 60) / 1000)
        this.setData({
          totalTime: totalTime,
          mm: mm,
          ss: this.addNumber(ss[0]),
          mins: ss[1]
        })
        clearInterval(misTimer)
      }
    }, 10)
  },
  /**
   * 计时
   */
  changeTime: function (gameTime) {
    clearInterval(this.data.gameTimer)
    this.data.gameTimer = setInterval(() => {
      if (gameTime < 1800) {
        if (!this.data.gameOver) {
          gameTime = gameTime + 1
          // var minutes = this.addNumber(parseInt((gameTime % (1000 * 60 * 60)) / (1000 * 60)))
          // var seconds = this.sliptNumber((gameTime % (1000 * 60)) / 1000);
          var minutes = this.addNumber(Math.floor(gameTime / 60 % 60));
          var seconds = this.addNumber(Math.floor(gameTime % 60));
          this.setData({
            minutes: minutes,
            seconds: seconds,
            gameTime: gameTime
          })
        } else {
          // 拼图完成 清除定时器 记录总时间 跳转完成页面 调用拼图完成接口
          clearInterval(this.data.gameTimer)
          this.setData({
            isStarted: false,
            showSuccess: true
          })
          this.submitGameTime()
        }
      } else {
        // 停止拼图
        wx.showToast({
          title: '拼图时间不能超过半小时',
          icon: 'none'
        })
        this.stopGame()
      }
    }, 1000)
  },
  /**
   * 计时格式
   */
  addNumber: function (num) {
    var num = (num > 9) ? num : ('0' + num);
    return num;
  },
  sliptNumber: function (num) {
    var num = num.toString()
    var numArr = num.split(".")
    // num.replace(".", ":")
    return numArr;
  },
  /**
   * 开始拼图接口
   */
  joinGame: function () {
    wx.request({
      url: config.config.postJoinActivityPintu,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        formId: this.data.formId
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
            consumeChances: res.data.bean.consumeChances
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.joinGame, this)
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
   * 拼图完成 提交时间
   */
  submitGameTime: function () {
    wx.request({
      url: config.config.postSubmitPintuActivityTime,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        consumeTime: this.data.totalTime
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data)
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitGameTime, this)
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
   * 关闭挑战成功弹框
   */
  closeSuccess: function (e) {
    var notifyFormId = e.detail.formId
    wx.request({
      url: config.config.postFormIdPintuActivity,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        formId: notifyFormId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // 刷新拼图页面信息
          this.getPintuCard()
          this.setData({
            showSuccess: false,
            gameTime: 0,
            gameOver: false
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.closeSuccess, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  gotoIndexx: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 关闭机会用完弹框
   */
  closeTipDialog: function () {
    this.setData({
      noChance: false
    })
    // 刷新拼图页面信息
    this.getPintuCard()
  },
  /**
   * 拼图 结束游戏 放弃挑战
   */
  stopGame: function () {
    clearInterval(this.data.gameTimer)
    this.setData({
      isStarted: false,
      gameTime: 0,
      minutes: '00',
      seconds: '00',
      mins: '00',
    })
    // 更新拼图页面信息
    this.getPintuCard()
  },
  /**
   * 获取抽奖情况
   */
  getPintuCard: function () {
    wx.request({
      url: config.config.getActivityPintuInfo,
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
          wx.stopPullDownRefresh()
          if (res.data.bean) {
            var shareUserId = res.data.partakeUserId != '' ? res.data.bean.partakeUserId : ''
            console.log("shareUserId" + shareUserId);
            var freeOrdersNumber = res.data.bean.itemNumTotal
            this.getSharePic('pintu' + freeOrdersNumber)
            var itemList = res.data.bean.freeOrdersItems
            if (itemList.length > 2) {
              this.setData({
                isShowMore: true,
                heightstyle: '504rpx'
              })
            }
            // var itemlistsub = itemList.splice(0, 2)
            this.setData({
              ordersItemNum: 1,
              deadline: res.data.bean.freeOrders.endTime,
              status: res.data.bean.userMaker.status,
              itemList: itemList,
              keysTotal: res.data.bean.keys,
              userPartake: res.data.bean.userPartake,
              chances: res.data.bean.chances,
              consumeChances: res.data.bean.consumeChances,
              gameConsumeTime: res.data.bean.consumeTime,
              imgUrl: res.data.bean.userMaker.jigsawPicture,
              userBingoList: res.data.bean.userBingoList,
              userMaker: res.data.bean.userMaker,
              shareUserId: shareUserId,
              total: res.data.total,
              itemNumTotal: res.data.bean.itemNumTotal
            })
            var param = {}
            for (var i in itemList) {
              param.propName = JSON.parse(itemList[i].productParamText).propName
              this.setData({
                ['itemList[' + i + '].productParamText']: param
              })
            }
            for (var i = 0; i < this.data.keysTotal; i++) {
              this.setData({
                ['keysNumber[' + i + ']']: i + 1
              })
            }
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getPintuCard, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  toggleItem: function () {
    if (this.data.heightstyle == '504rpx') {
      this.setData({
        heightstyle: 200 * this.data.itemList.length + 94 + 'rpx',
        up: true
      })
    } else {
      this.setData({
        heightstyle: '504rpx',
        up: false
      })
    }
  },
  /**
   * 返回首页
   */
  gotoIndex: function (e) {
    var notifyFormId = e.detail.formId
    wx.request({
      url: config.config.postPintuFormid,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        notifyFormId: notifyFormId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // wx.reLaunch({
          //   url: '/pages/index/index'
          // })
          wx.navigateTo({
            url: '/pages/special/special?id=SL1532073212938&title=七夕情人节',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.gotoGifts, this)
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
   * 去送礼
   */
  gotoGifts: function (e) {
    var notifyFormId = e.detail.formId
    wx.request({
      url: config.config.postFormIdPintuActivity,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        formId: notifyFormId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.reLaunch({
            url: '/pages/gifts/gifts',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.gotoGifts, this)
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
    if (options.ordersId) {
      this.setData({
        ordersId: options.ordersId
      })
    }
    setTimeout(() => {
      this.setData({
        hidetip: false
      })
    }, 1500)
    setTimeout(() => {
      this.setData({
        showTips: false
      })
    }, 5000)
    setTimeout(() => {
      this.setData({
        hidetip: true
      })
    }, 5500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        this.getPintuCard()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getPintuCard()
      }
    })
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
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getPintuCard()
    this.setData({
      up: false
    })
  },

  shareHelp: function () {
    wx.navigateTo({
      url: '/pages/activityPintuHelp/activityPintuHelp?ordersId=' + this.data.ordersId + '&shareUserId=' + this.data.shareUserId,
    })
  },
  // 获取分享小图
  getSharePic: function (configKey) {
    wx.request({
      url: config.config.getSharePic,
      data: {
        configKey: configKey,
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean) {
            this.setData({
              sharePic: res.data.bean.configValue,
              shareText: res.data.bean.description
            })
          } else {
            this.setData({
              sharePic: 'https://image.prise.shop/images/2018/06/26/1529998563098111.png',
              shareText: '我正在参与拼图赢大礼，只差你的一步助力！'
            })
          }          
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
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
            console.log('点击分享了' + this.data.shareUserId)
          }
        }
      })
      return {
        title: this.data.shareText,
        path: '/pages/activityPintuHelp/activityPintuHelp?ordersId=' + this.data.ordersId + '&shareUserId=' + this.data.shareUserId,
        imageUrl: this.data.sharePic
      }
    } 
    return {
      title: '拼图赢奖品，就等你来玩！',
      path: '/pages/activityPintu/activityPintu?ordersId=' + this.data.ordersId,
      imageUrl: 'https://image.prise.shop/images/2018/06/20/1529489590791131.png'
    }
  }
})
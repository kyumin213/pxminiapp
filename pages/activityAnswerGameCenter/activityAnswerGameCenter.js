// pages/activityAnswerCenter/activityAnswerCenter.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    currentQuestion: 0,
    correctObj: { 'A': '0', 'B': '1', 'C': '2', 'D': '3' },
    totalCorrectNum: 0,
    seconds: 10,
    secondsrotate: 0,
    showTimeline: true
  },
  gotoIndex: function (e) {
    var notifyFormId = e.detail.formId
    wx.request({
      url: config.config.postFormIdAnswerActivity,
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
          // wx.navigateTo({
          //   url: '/pages/index/index',
          // })
          wx.navigateTo({
            url: '/pages/special/special?id=SL1534497732291&title=教师节',            
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.gotoIndex, this)
        }
      }
    })
  },
  // 关闭结果框
  toggleResultBox: function (e) {
    var notifyFormId = e.detail.formId
    wx.request({
      url: config.config.postFormIdAnswerActivity,
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
          this.setData({
            showResult: !this.data.showResult
          })
          wx.navigateBack({
            delta: 1
          })
          // wx.redirectTo({
          //   url: '/pages/activityAnswer/activityAnswer?ordersId=' + this.data.ordersId,
          // })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.toggleResultBox, this)
        }
      }
    })
  },
  // 再答一次
  gotoGameAgain: function () {
    wx.navigateBack({
      delta: 1
    })
    // wx.redirectTo({
    //   url: '/pages/activityAnswer/activityAnswer?ordersId=' + this.data.ordersId,
    // })
  },
  /**
   * 获取实时数据显示
   */
  getActiveData: function () {
    wx.request({
      url: config.config.getActivityAnswerData,
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
          this.setData({
            chance: res.data.bean.chance,
            beatNum: res.data.bean.beatNum,
            partakers: res.data.bean.partakers,
            gameConsumeTime: res.data.bean.gameConsumeTime,
            hitNum: res.data.bean.hitNum
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getActiveData, this)
        }
      }
    })
  },
  /**
   * 获取答题题目
   */
  getAnswerQuestion: function (limits) {
    wx.request({
      url: config.config.getQuestion,
      data: {
        token: this.data.token,
        limits: limits
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var questionList = res.data.bean
          this.setData({
            questionList: res.data.bean
          })
          var chooseAnswers = {}
          for (var i in questionList) {
            chooseAnswers = JSON.parse(questionList[i].chooseAnswers)
            this.setData({
              ['questionList[' + i + '].chooseAnswers']: chooseAnswers,
              ['questionList[' + i + '].canclick']: true
            })
          }
          console.log(this.data.questionList)
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getAnswerQuestion, this)
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
   * 比较答案
   */
  checkAnswer: function (e) {
    var currentQuestion = this.data.currentQuestion
    if (this.data.questionList[currentQuestion].canclick) {
      var index = e.currentTarget.dataset.index
      var selectedValue = this.data.questionList[currentQuestion].chooseAnswers[index].choose
      var correctValue = this.data.questionList[currentQuestion].answer
      var correctIndex = this.data.correctObj[correctValue]
      // 设置当前题目禁止点击
      this.setData({
        ['questionList[' + currentQuestion + '].canclick']: false
      })
      for (var i in this.data.questionList[currentQuestion].chooseAnswers) {
        this.setData({
          ['questionList[' + currentQuestion + '].chooseAnswers[' + i + '].isCorrect']: false,
          ['questionList[' + currentQuestion + '].chooseAnswers[' + i + '].isError']: false
        })
      }
      if (selectedValue == correctValue) {
        this.data.totalCorrectNum++
        this.setData({
          ['questionList[' + currentQuestion + '].chooseAnswers[' + index + '].isCorrect']: true,
          totalCorrectNum: this.data.totalCorrectNum
        })
      } else {
        // console.log(selectedValue, correctValue)
        this.setData({
          ['questionList[' + currentQuestion + '].chooseAnswers[' + correctIndex + '].isCorrect']: true,
          ['questionList[' + currentQuestion + '].chooseAnswers[' + index + '].isError']: true,
          errorSelect: true
        })
      }
      // 清除上一个定时器 进入下一道答题
      clearInterval(this.data.questionTimer)
      // this.setData({
      //   showTimeline: false
      // })
      setTimeout(() => {
        this.setData({
          errorSelect: false,
          showTimeline: false
        })
        // 最后一道题则设置gameOver为true
        if (this.data.currentQuestion == this.data.questionList.length - 1) {
          this.setData({
            gameOver: true
          })
        }
        if (this.data.currentQuestion < this.data.questionList.length - 1) {
          this.data.currentQuestion++
          this.setData({
            seconds: 10,
            showTimeline: true,
            rotatenum: -45,
            secondsrotate: 0,
            currentQuestion: this.data.currentQuestion
          })
          this.countDown()
        }
      }, 500)
    }
  },
  /**
   * 题目10s倒计时
   */
  countDown: function () {
    clearInterval(this.data.questionTimer)
    this.data.questionTimer = setInterval(() => {
      if (this.data.seconds > 0) {
        this.data.seconds--
        this.data.secondsrotate++
        this.setData({
          seconds: this.data.seconds,
          secondsrotate: this.data.secondsrotate,
          rotatenum: -45 + this.data.secondsrotate * 18
        })
      } else {
        // 10s 结束 清除定时器 
        clearInterval(this.data.questionTimer)
        // 10s耗完 禁止再次点击
        var currentQuestion = this.data.currentQuestion
        this.setData({
          ['questionList[' + currentQuestion + '].canclick']: false
        })
        // 暂停2s再进入下一题
        setTimeout(() => {
          this.setData({
            showTimeline: false
          })
          if (this.data.currentQuestion < this.data.questionList.length - 1) {
            this.data.currentQuestion++
            this.setData({
              seconds: 10,
              currentQuestion: this.data.currentQuestion,
              rotatenum: -45,
              secondsrotate: 0,
              showTimeline: true
            })
            this.countDown()
          }
        }, 2000)
        // 最后一道题10s结束后弹出提示框显示答题时间及正确率 自动提交
        if (this.data.currentQuestion == this.data.questionList.length - 1) {
          this.setData({
            gameOver: true
          })
        }
      }
    }, 1000)
  },
  /**
   * 记录游戏起止时间
   */
  recordGameTime: function () {
    var date = new Date()
    var startTime = date.getTime()
    // 毫秒计时
    var misTimer = setInterval(() => {
      if (this.data.gameOver) {
        var date = new Date()
        var endTime = date.getTime()
        // 查看原图耗时
        var totalTime = endTime - startTime - 1000
        var mm = this.addNumber(parseInt((totalTime % (1000 * 60 * 60)) / (1000 * 60)))
        var ss = this.sliptNumber(totalTime % (1000 * 60) / 1000)
        console.log(endTime, mm, ss)
        this.setData({
          totalTime: totalTime,
          mm: mm,
          ss: this.addNumber(ss[0]),
          mins: ss[1]
        })
        clearInterval(misTimer)
        // 提交答题时间
        this.submitAnswerTime()
      }
    }, 10)
  },
  /**
   * 提交答题时间
   */
  submitAnswerTime: function () {
    wx.request({
      url: config.config.postSubmitAnswerActivityTime,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        consumeTime: this.data.totalTime,
        hitNum: this.data.totalCorrectNum,
        // notifyFormId: this.data.formId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            showResult: true
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitAnswerTime, this)
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
   * 计时格式
   */
  addNumber: function (num) {
    var num = (num > 9) ? num : ('0' + num);
    return num;
  },
  sliptNumber: function (num) {
    var num = num.toString()
    var numArr = num.split(".")
    return numArr;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ordersId: options.ordersId,
      qustionNumber: options.qustionNumber,
      // formId: options.formId,
      userId: options.userId
    })
    // console.log(options.userId)
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        this.getAnswerQuestion(this.data.qustionNumber)
        this.countDown()
        this.recordGameTime()
        this.getActiveData()
      }
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
    wx.getSystemInfo({
      success: (res) => {
        console.log(res.system)
        console.log(res.system.toLocaleLowerCase())
        if (res.system.toLocaleLowerCase().indexOf('ios') > -1) {
          this.setData({
            topValue: -70
          })
        } else {
          this.setData({
            topValue: -68
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.questionTimer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.questionTimer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.target.id == 'getRelive') {
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
        title: '我正在参与答题赢大礼，只差一张你的复活卡!',
        path: '/pages/assistanceActivityAnswer/assistanceActivityAnswer?ordersId=' + this.data.ordersId + '&shareUserId=' + this.data.userId,
        imageUrl: 'https://image.prise.shop/images/2018/07/05/1530775084567947.png'
      }
    } else if (res.target.id == 'joinGame') {
      return {
        title: '快来挑战赢走属于你的七夕礼物吧！',
        path: '/pages/activityAnswer/activityAnswer?ordersId=' + this.data.ordersId,
        imageUrl: 'https://image.prise.shop/images/2018/07/05/1530775081468058.png'
      }
    }
  }
})
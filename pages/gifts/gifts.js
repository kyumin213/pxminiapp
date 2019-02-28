// pages/gifts/gifts.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '',
    currentkey: 1,
    currentnumber: 1,
    keyArr: [16, 20, 25],
    questionArr: [10, 15, 20],
    dayArr: ['1', '2', '3', '4', '5', '6', '7'],
    peopleArr: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
    peopleindex: '2',
    numberArr: ['4 x 4','5 x 5', '6 x 6', '7 x 7'],
    pintuKeys: [4, 5, 6, 7],
    answerNumArr: [10,15,20],
    answernumindex: 0,
    keysNumArr: [16,20,25],
    keysindex: 0,
    selectedNum: 0,
    index: 6,
    answerindex: 6,
    pintuIndex: 6,
    diceindex: 6,
    giftCarList: {},
    ordersPay: '0.00',
    itemList: [],
    total: 0,
    rows: 0,
    showNum: 3,
    isShowAll: false,
    isSeaAmoy: false,
    idcardNumber: '',
    goodsNumber: '',
    navTab: ["我要送礼物", "我要收礼物"],
    currentNavtab: 0,
    showPop: false,
    giftTips: ["", "悄悄送礼", "开箱送礼", "拼图送礼", "答题送礼", "群送礼"],
    canClickSendBtn: true,
    groupnumber: 1,
    tabsindexs: 1,
    canClick: true,
    checked: true
  },
  toggleTab: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      tabsindexs: index,
    })
    if (index == 1) {
      this.setData({
        current: 7
      })
    } else {
      this.setData({
        current: 4
      })
    }
    wx.setStorageSync("tabsindexs", index)
  },
  /**
  * 去许愿树
  */
  gotoWishing: function () {
    if (this.data.isLogin) {
      if (this.data.canClick) {
        this.getUserStatus()
      }
    } else {
      // 未登录直接进入选取愿望页面
      wx.navigateTo({
        url: '/packageA/pages/wishing/wishing',
      })
    }
  },
  /**
   * 判断用户种树状态 0：全新玩家；1：没有许愿树；2：有许愿树；3：有成熟的果实;4：已摘取；5：已脱落；
   */
  getUserStatus: function () {
    this.setData({
      canClick: false
    })
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
        this.setData({
          canClick: true
        })
        if (res.data.status == 200) {          
          if (res.data.bean == 0) {
            wx.navigateTo({
              url: '/packageA/pages/wishing/wishing?isNew=true',
            })
          } else if (res.data.bean == 1 || res.data.bean == 4) {
            wx.navigateTo({
              url: '/packageA/pages/wishing/wishing',
            })
          } else if (res.data.bean == 2 || res.data.bean == 3 || res.data.bean == 5) {
            wx.navigateTo({
              url: '/packageA/pages/wishTree/wishTree',
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
  gotoActivity: function () {
    wx.reLaunch({
      url: '/pages/activityList/activityList',
    })
  },
  /**
   * 去活动页面 
   */
  // 玩法介绍
  gotoPlayMethod: function () {
    wx.navigateTo({
      url: '/pages/playMethod/playMethod',
    })
  },
  /**
   * 跳转 优惠券页面
   */
  gotoCoupon: function () {
    wx.navigateTo({
      url: '/pages/couponList/couponList?totalPrice=' + this.data.productPrice,
    })
  },
  gotoAnswerGame: function () {
    wx.navigateTo({
      url: '/pages/answerGame/answerGame',
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
  gotoCar: function () {
    wx.navigateTo({
      url: '/pages/shoppingCar/shoppingCar',
    })
  },
  gotoUser: function () {
    wx.navigateTo({
      url: '/pages/me/me',
    })
  },
  selectNumber: function () {
    wx.showActionSheet({
      itemList: ['4 x 4','5 x 5', '6 x 6', '7 x 7'],
      success: (res) => {
        console.log(res.tapIndex)
        this.setData({
          selectedNum: res.tapIndex
        })
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 关闭送礼方式弹框
   */
  togglePop: function () {
      this.setData({
        showPop: !this.data.showPop,
        showMessage: !this.data.showMessage
      })
  },
  /**
   * 送礼方式切换
   */
  toggleMode: function (e) {
    var index = e.currentTarget.dataset.index    
    if (index != 10) {
      this.setData({
        current: index
      })
      wx.setStorageSync('current', index)
    }      
  },
  /**
   * 导航切换
   */
  swichNav: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentNavtab: index
    })
  },
  toggleKey: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentkey: index
    })
    wx.setStorageSync('currentkey', index)
  },
  toggleAnswer: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentnumber: index
    })
    wx.setStorageSync('currentnumber', index)
  },
  // 开箱钥匙数量选择
  bindKeysNumPickerChange: function (e) {
    this.setData({
      keysindex: e.detail.value
    })
  },
  // 开箱活动天数选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChangePintu: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pintuIndex: e.detail.value
    })
  },
  bindAnswerPickerChange: function (e) {
    this.setData({
      answerindex: e.detail.value
    })
  },
  bindAnswerNumPickerChange: function (e) {
    this.setData({
      answernumindex: e.detail.value
    })
  },
  bindDicePickerChange: function (e) {
    this.setData({
      diceindex: e.detail.value
    })
  },
  // 拼团人数选择
  bindPintuanPickerChange: function (e) {
    this.setData({
      peopleindex: e.detail.value,
      groupnumber: this.data.peopleArr[e.detail.value]
    })
    wx.setStorageSync('groupnumber', this.data.groupnumber)
    wx.setStorageSync('peopleindex', this.data.peopleindex)
    this.getGiftCar(this.data.groupnumber)
  },
  gotoAllSpecial: function () {
    wx.navigateTo({
      url: '/pages/allSpecial/allSpecial',
    })
  },
  bindIdcardInput: function (e) {
    this.setData({
      idcardNumber: e.detail.value
    })
  },
  blurIDcard: function () {
    var idcardNumber = this.data.idcardNumber
    wx.setStorageSync('idcardNumber', idcardNumber)
  },
  bindremarkinput: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  bindremarkblur: function () {
    console.log(this.data.remarks)
    wx.setStorageSync('remarks', this.data.remarks)
  },
  bindremarkinputGroup: function (e) {
    this.setData({
      remarksGroup: e.detail.value
    })
  },
  bindremarkinputDice: function (e) {
    this.setData({
      remarksDice: e.detail.value
    })
  },
  bindremarkblurGroup: function () {
    console.log(this.data.remarksGroup)
    wx.setStorageSync('remarksGroup', this.data.remarksGroup)
  },
  bindremarkblurDice: function () {
    console.log(this.data.remarksDice)
    wx.setStorageSync('remarksDice', this.data.remarksDice)
  },
  bindremarkinputDirect: function (e) {
    this.setData({
      remarksDirect: e.detail.value
    })
  },
  bindremarkblurDirect: function () {
    wx.setStorageSync('remarksDirect', this.data.remarksDirect)
  },
  
  /**
   * 检测用户手机号
   */
  getUserPhone: function () {
    wx.request({
      url: config.config.getUserPhone,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          app.globalData.userPhone = res.data.bean
          this.setData({
            userPhone: res.data.bean,
            hasUserPhone: true
          })
          // 已经绑定则调用立即购买
          // this.buyNowFun()
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.getUserPhone)
          utils.getUserInfoFun(this.getUserPhone, this)
        } else {
          this.setData({
            hasUserPhone: false
          })
        }
      },
    })
  },
  /**
   * 点击送礼按钮检测状态
   */
  sendGifts: function (e) {
    if (this.data.canClickSendBtn) {
      this.setData({
        formId: e.detail.formId
      })
      console.log(this.data.remarks)
      if (this.data.itemList.length < 1) {
        utils.showTips('请先选择礼物')
      } else if (this.data.current == '') {
        utils.showTips('请选择送礼方式')        
      } else if (this.data.remarks.length > 17 && this.data.current == 1) {
        utils.showTips('留言不能超过18个字符')    
      } else if (this.data.isSeaAmoy == true) {
        if (this.data.idcardNumber == '') {
          utils.showTips('请输入您的身份证号')   
        } else {
          var regName = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
          if (!regName.test(this.data.idcardNumber)) {
            utils.showTips('身份证格式有误')               
          } else {
            if (this.data.current == 1) {
              this.setData({
                canClickSendBtn: false
              })
              this.payOrderAll()
            } else if (this.data.current == 2) {
              this.setData({
                canClickSendBtn: false
              })
              this.payOrderAll()              
            } else if (this.data.current == 3) {
              if (this.data.selectedImg == '') {
                utils.showTips('请选择拼图图片')                               
              } else {
                this.setData({
                  canClickSendBtn: false
                })
                this.payOrderAll()                
              }
            } else if (this.data.current == 4 ) {
              this.setData({
                canClickSendBtn: false
              })
              this.payOrderAll()              
            } else if (this.data.current == 5) {
              this.setData({
                canClickSendBtn: false
              })
              this.payGroupOrder()        
            } else if (this.data.current == 6 || this.data.current == 7){
              this.setData({
                canClickSendBtn: false
              })
              this.payOrderAll()  
            }
          }
        }
      } else {
        if (this.data.current == 1) {
          this.setData({
            canClickSendBtn: false
          })
          this.payOrderAll()          
        } else if (this.data.current == 2) {
          this.setData({
            canClickSendBtn: false
          })
          this.payOrderAll()          
        } else if (this.data.current == 3) {
          if (this.data.selectedImg == '') {
            utils.showTips('请选择拼图图片')                                           
          } else {
            this.setData({
              canClickSendBtn: false
            })
            this.payOrderAll()            
          }
        } else if (this.data.current == 4) {
          this.setData({
            canClickSendBtn: false
          })
          this.payOrderAll()          
        } else if (this.data.current == 5) {
          this.setData({
            canClickSendBtn: false
          })
          this.payGroupOrder()       
        } else if (this.data.current == 6 || this.data.current == 7) {
          this.setData({
            canClickSendBtn: false
          })
          this.payOrderAll()  
        }
      }
    }
  },
  /**
   * 支付订单 全部
   */
  payOrderAll: function () {
    if (this.data.hasUserPhone) {
      if (this.data.current == 1) {
        var remarks = this.data.remarks ? this.data.remarks : '大吉大利，给您派喜'
      } else if (this.data.current == 6) {
        var remarks = this.data.remarksDice || '摇点数，比大小，你敢摇我敢送！'
      } else if (this.data.current == 7) {
        var remarks = this.data.remarksDirect || '大吉大利，送你好礼！'
      } else {
        var remarks = ''
      }
      var category = ''
      if (this.data.current == 6) {
        category = 10
      } else if (this.data.current == 7) {
        category = 11
      } else {
        category = this.data.current
      }
      var idCard = this.data.idcardNumber ? this.data.idcardNumber : ''
      wx.request({
        url: config.config.postGiftOrderAll,
        data: {
          token: this.data.token,
          priceTotal: this.data.ordersPay,
          remarks: remarks,
          category: category,
          idCard: idCard,
          // formId: this.data.formId
        },
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            wx.requestPayment({
              'timeStamp': res.data.bean.timeStamp,
              'nonceStr': res.data.bean.nonceStr,
              'package': res.data.bean.package,
              'signType': 'MD5',
              'paySign': res.data.bean.sign,
              'success': (res) => {
                console.log(res)
                // 支付成功再提交订单信息
                this.submitGiftOrderAll()
                this.setData({
                  canClickSendBtn: true
                })
              },
              'fail': (res) => {
                this.setData({
                  canClickSendBtn: true
                })
              }
            })
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.payOrderAll, this)
          }
        }
      })
    } else {
      var title = '绑定手机号'
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone?title=' + title,
      })
    }
  },
  /**
   * 提交订单 全部玩法
   */
  submitGiftOrderAll: function () {
    var jigsawPicture = ''
    var keys = ''
    var endDays = ''
    if (this.data.current == 2) {
      keys = this.data.keysNumArr[this.data.keysindex]
      endDays = this.data.dayArr[this.data.index]
    } else if (this.data.current == 3) {
      keys = this.data.pintuKeys[this.data.selectedNum]
      endDays = this.data.dayArr[this.data.pintuIndex]
      jigsawPicture = this.data.selectedImg
    } else if (this.data.current == 4) {
      keys = this.data.answerNumArr[this.data.answernumindex]
      endDays = this.data.dayArr[this.data.answerindex]
    } else if (this.data.current == 5) {
      keys = this.data.peopleArr[this.data.peopleindex]
      endDays = 15
    } else if (this.data.current == 6) {
      endDays = this.data.dayArr[this.data.diceindex]
    }
    wx.request({
      url: config.config.postsubmitGiftOrderAll,
      data: {
        token: this.data.token,
        jigsawPicture: jigsawPicture,
        formId: this.data.formId,
        keys: keys,
        endDays: endDays
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var ordersId = res.data.bean
          if (this.data.current == 1) {
            wx.navigateTo({
              url: '/pages/giftCard/giftCard?ordersId=' + ordersId,
            })
          } else if (this.data.current == 2) {
            wx.navigateTo({
              url: '/pages/giftCardBox/giftCardBox?ordersId=' + ordersId,
            })
          } else if (this.data.current == 3) {
            wx.navigateTo({
              url: '/pages/giftCardPintu/giftCardPintu?ordersId=' + ordersId,
            })
          } else if (this.data.current == 4) {
            wx.navigateTo({
              url: '/pages/giftCardAnswer/giftCardAnswer?ordersId=' + ordersId,
            })
          } else if (this.data.current == 5) {
            wx.navigateTo({
              url: '/pages/giftCardGroup/giftCardGroup?ordersId=' + ordersId,
            })
          } else if (this.data.current == 6) {
            wx.navigateTo({
              url: '/pages/giftCardDice/giftCardDice?ordersId=' + ordersId,
            })
          } else if (this.data.current == 7) {
            wx.navigateTo({
              url: '/pages/giftCardDirect/giftCardDirect?ordersId=' + ordersId,
            })
          }     
          
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.submitGiftOrder)
          utils.getUserInfoFun(this.submitGiftOrderAll, this)
        } else {
          utils.showTips(res.data.msg)                                                     
        }
      }
    })
  },
  /**
   * 支付订单 悄悄送礼
   */
  payOrder: function () {
    if (this.data.hasUserPhone) {
      var remarks = this.data.remarks ? this.data.remarks : '大吉大利，给您派喜'
      var idCard = this.data.idcardNumber ? this.data.idcardNumber : ''
      wx.request({
        url: config.config.postPayGiftOrder,
        data: {
          token: this.data.token,
          priceTotal: this.data.ordersPay,
          remarks: remarks,
          category: this.data.current,
          idCard: idCard,
          formId: this.data.formId
        },
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            wx.requestPayment({
              'timeStamp': res.data.bean.timeStamp,
              'nonceStr': res.data.bean.nonceStr,
              'package': res.data.bean.package,
              'signType': 'MD5',
              'paySign': res.data.bean.sign,
              'success': (res) => {
                console.log(res)
                // 支付成功再提交订单信息
                this.submitGiftOrder()
                this.setData({
                  canClickSendBtn: true
                })
              },
              'fail': (res) => {
                console.log('fail')
                this.setData({
                  canClickSendBtn: true
                })
              }
            })
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.payOrder, this)
          }
        }
      })
    } else {
      var title = '绑定手机号'
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone?title=' + title,
      })
    }
  },
  /**
   * 支付成功之后提交订单信息
   */
  submitGiftOrder: function () {
    var remarks = this.data.remarks ? this.data.remarks : '大吉大利，给您派喜'
    var idCard = this.data.idcardNumber ? this.data.idcardNumber : ''
    wx.request({
      url: config.config.postSubmitGiftOrder,
      data: {
        token: this.data.token,
        remarks: remarks,
        priceTotal: this.data.ordersPay,
        category: this.data.current,
        idCard: idCard,
        formId: this.data.formId
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var ordersId = res.data.bean
          wx.navigateTo({
            url: '/pages/giftCard/giftCard?ordersId=' + ordersId,
          })
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.submitGiftOrder)
          utils.getUserInfoFun(this.submitGiftOrder, this)
        } else {
          utils.showTips(res.data.msg)                                                     
        }
      }
    })
  },
  /**
   * 支付订单 开箱子
   */
  payOrderBox: function () {
    if (this.data.hasUserPhone) {
      // var remarks = this.data.remarks ? this.data.remarks : '大吉大利，给您派喜'
      var idCard = this.data.idcardNumber ? this.data.idcardNumber : ''
      wx.request({
        url: config.config.postPayBoxOrder,
        data: {
          token: this.data.token,
          priceTotal: this.data.ordersPay,
          category: this.data.current,
          idCard: idCard,
          keys: this.data.keysNumArr[this.data.keysindex],
          endDays: this.data.dayArr[this.data.index]
        },
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            console.log(res.data.bean)
            wx.requestPayment({
              'timeStamp': res.data.bean.timeStamp,
              'nonceStr': res.data.bean.nonceStr,
              'package': res.data.bean.package,
              'signType': 'MD5',
              'paySign': res.data.bean.sign,
              'success': (res) => {
                console.log(res)
                // 支付成功再提交订单信息
                this.submitBoxOrder()
                this.setData({
                  canClickSendBtn: true
                })
              },
              'fail': (res) => {
                console.log('fail')
                this.setData({
                  canClickSendBtn: true
                })
              }
            })
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.payOrderBox, this)
          }
        }
      })
    } else {
      var title = '绑定手机号'
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone?title=' + title,
      })
    }
  },
  /**
   * 提交开箱子订单明细
   */
  submitBoxOrder: function () {
    wx.request({
      url: config.config.postSubmitBoxOrder,
      data: {
        token: this.data.token,
        keys: this.data.keysNumArr[this.data.keysindex],
        endDays: this.data.dayArr[this.data.index],
        formId: this.data.formId
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var ordersId = res.data.bean
          wx.navigateTo({
            url: '/pages/giftCardBox/giftCardBox?ordersId=' + ordersId,
          })
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.submitBoxOrder)
          utils.getUserInfoFun(this.submitBoxOrder, this)
        } else {
          utils.showTips(res.data.msg)                                                     
        }
      }
    })
  },
  /**
   * 支付订单 拼图送礼
   */
  payPintuOrder: function () {
    if (this.data.hasUserPhone) {
      var idCard = this.data.idcardNumber ? this.data.idcardNumber : ''
      var keys = this.data.pintuKeys[this.data.selectedNum]
      var jigsawPicture = this.data.selectedImg
      wx.request({
        url: config.config.postPayPintuOrder,
        data: {
          token: this.data.token,
          priceTotal: this.data.ordersPay,
          category: this.data.current,
          idCard: idCard,
          jigsawPicture: jigsawPicture,
          keys: keys,
          endDays: this.data.dayArr[this.data.pintuIndex]
        },
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            console.log(res.data.bean)
            wx.requestPayment({
              'timeStamp': res.data.bean.timeStamp,
              'nonceStr': res.data.bean.nonceStr,
              'package': res.data.bean.package,
              'signType': 'MD5',
              'paySign': res.data.bean.sign,
              'success': (res) => {
                console.log(res)
                // 支付成功再提交订单信息
                this.submitPintuOrder()
                this.setData({
                  canClickSendBtn: true
                })
              },
              'fail': (res) => {
                console.log('fail')
                this.setData({
                  canClickSendBtn: true
                })
              }
            })
          } else if (res.data.status == 801) {
            // this.getUserInfoFun(this.payPintuOrder)
            utils.getUserInfoFun(this.payPintuOrder, this)
          }
        }
      })
    } else {
      var title = '绑定手机号'
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone?title=' + title,
      })
    }
  },
  /**
   * 提交拼图订单明细
   */
  submitPintuOrder: function () {
    var keys = this.data.pintuKeys[this.data.selectedNum]
    var jigsawPicture = this.data.selectedImg
    wx.request({
      url: config.config.postSubmitPintuOrder,
      data: {
        token: this.data.token,
        jigsawPicture: jigsawPicture,
        keys: keys,
        endDays: this.data.dayArr[this.data.pintuIndex],
        formId: this.data.formId
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var ordersId = res.data.bean
          wx.navigateTo({
            url: '/pages/giftCardPintu/giftCardPintu?ordersId=' + ordersId,
          })
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.submitPintuOrder)
          utils.getUserInfoFun(this.submitPintuOrder, this)
        } else {
          utils.showTips(res.data.msg)                                                     
        }
      }
    })
  },
  /**
   * 支付订单 答题送礼
   */
  payAnswerOrder: function () {
    if (this.data.hasUserPhone) {
      var idCard = this.data.idcardNumber ? this.data.idcardNumber : ''
      // var keys = this.data.questionArr[this.data.currentnumber - 1]
      var keys = this.data.answerNumArr[this.data.answernumindex]
      wx.request({
        url: config.config.postPayAnswerOrder,
        data: {
          token: this.data.token,
          priceTotal: this.data.ordersPay,
          category: this.data.current,
          idCard: idCard,
          keys: keys,
          endDays: this.data.dayArr[this.data.answerindex]
        },
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            console.log(res.data.bean)
            wx.requestPayment({
              'timeStamp': res.data.bean.timeStamp,
              'nonceStr': res.data.bean.nonceStr,
              'package': res.data.bean.package,
              'signType': 'MD5',
              'paySign': res.data.bean.sign,
              'success': (res) => {
                console.log(res)
                // 支付成功再提交订单信息
                this.submitAnswerOrder()
                this.setData({
                  canClickSendBtn: true
                })
              },
              'fail': (res) => {
                console.log('fail')
                this.setData({
                  canClickSendBtn: true
                })
              }
            })
          } else if (res.data.status == 801) {
            // this.getUserInfoFun(this.payPintuOrder)
            utils.getUserInfoFun(this.payPintuOrder, this)
          }
        }
      })
    } else {
      var title = '绑定手机号'
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone?title=' + title,
      })
    }
  },
  /**
   * 提交订单 答题送礼
   */
  submitAnswerOrder: function () {
    // var keys = this.data.questionArr[this.data.currentnumber - 1]
    var keys = this.data.answerNumArr[this.data.answernumindex]    
    wx.request({
      url: config.config.postSubmitAnswerOrder,
      data: {
        token: this.data.token,
        keys: keys,
        endDays: this.data.dayArr[this.data.answerindex],
        formId: this.data.formId
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var ordersId = res.data.bean
          wx.navigateTo({
            url: '/pages/giftCardAnswer/giftCardAnswer?ordersId=' + ordersId,
          })
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.submitAnswerOrder)
          utils.getUserInfoFun(this.submitAnswerOrder, this)
        } else {
          utils.showTips(res.data.msg)        
        }
      }
    })
  },
  /**
   * 群送礼 支付
   */
  payGroupOrder: function () {
    if (this.data.hasUserPhone) {
      var idCard = this.data.idcardNumber ? this.data.idcardNumber : ''
      var keys = this.data.peopleArr[this.data.peopleindex]
      var remarksGroup = this.data.remarksGroup
      wx.request({
        url: config.config.postPayGroupOrder,
        data: {
          token: this.data.token,
          priceTotal: this.data.ordersPay,
          idCard: idCard,
          keys: keys,
          endDays: 15,
          priceSplit: this.data.priceSplit,
          addressWay: 8,
          remarks: remarksGroup
        },
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            console.log(res.data.bean)
            wx.requestPayment({
              'timeStamp': res.data.bean.timeStamp,
              'nonceStr': res.data.bean.nonceStr,
              'package': res.data.bean.package,
              'signType': 'MD5',
              'paySign': res.data.bean.sign,
              'success': (res) => {
                console.log(res)
                // 支付成功再提交订单信息
                this.submitGroupOrder()
                this.setData({
                  canClickSendBtn: true
                })
              },
              'fail': (res) => {
                console.log('fail')
                this.setData({
                  canClickSendBtn: true
                })
              }
            })
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.payGroupOrder, this)
          }
        }
      })
    } else {
      var title = '绑定手机号'
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone?title=' + title,
      })
    }
  },
  /**
   * 提交拼团订单
   */
  submitGroupOrder: function () {
    var remarksGroup = this.data.remarksGroup    
    wx.request({
      url: config.config.postSubmitGroupOrder,
      data: {
        token: this.data.token,
        keys: this.data.peopleArr[this.data.peopleindex],
        endDays: 15,
        formId: this.data.formId,
        priceSplit: this.data.priceSplit,
        priceTotal: this.data.ordersPay,
        remarks: remarksGroup
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var ordersId = res.data.bean
          wx.navigateTo({
            url: '/pages/giftCardGroup/giftCardGroup?ordersId=' + ordersId,
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitGroupOrder, this)
        } else {
          utils.showTips(res.data.msg)                                                     
        }
      }
    })
  },
  gotoRecord: function () {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/recordSendOut/recordSendOut',
      })
    }
  },
  gotoDetails: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.itemList[index].productId
    wx.navigateTo({
      url: '/pages/giftDetails/giftDetails?id=' + id,
    })
  },
  /**
   * 获取购物车
   */
  getGiftCar: function (keys) {
    wx.request({
      url: config.config.getGiftCar,
      data: {
        token: this.data.token,
        keys: keys
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // 商品总条目大于3显示查看全部按钮
          if (res.data.total > 3) {
            this.setData({
              isShowAll: true
            })
          }
          // 开始渲染3条itemList 点击查看全部重新给itemList赋值为所有的
          var itemList = res.data.bean.itemList
          // 检查是否有海淘产品
          var isSeaAmoy = false
          for (var i in itemList) {
            if (itemList[i].isSeaAmoy == 1) {
              isSeaAmoy = true
            }
          }
          this.setData({
            isSeaAmoy: isSeaAmoy
          })
          // itemlistsub为前三个礼物列表
          var itemlistsub = itemList.splice(0, 3)
          this.setData({
            giftCarList: res.data.bean,
            itemList: itemlistsub,
            total: res.data.bean.number,
            ordersPay: res.data.bean.ordersPay,
            rows: res.data.total,
            reduceCoupon: res.data.bean.reduceCoupon,
            reducePrice: res.data.bean.reducePrice,
            productPrice: res.data.bean.productPrice,
            priceSplit: res.data.bean.priceSplit
          })
          var param = {}
          for (var i in itemlistsub) {
            param.propName = JSON.parse(itemlistsub[i].productParamText).propName
            this.setData({
              ['itemList[' + i + '].productParamText']: param
            })
          }
        }
      }
    })
  },
  showAllItem: function () {
    this.setData({
      isShowAll: false
    })
    wx.request({
      url: config.config.getGiftCar,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // 开始渲染3条itemList 点击查看全部重新给itemList赋值为所有的
          var itemList = res.data.bean.itemList
          this.setData({
            giftCarList: res.data.bean,
            itemList: itemList,
            total: res.data.bean.number,
            ordersPay: res.data.bean.ordersPay,
            rows: res.data.total
          })
          var param = {}
          for (var i in itemList) {
            param.propName = JSON.parse(itemList[i].productParamText).propName
            this.setData({
              ['itemList[' + i + '].productParamText']: param
            })
          }

        }
      }
    })
  },
  /**
   * 修改商品数量方法
   */
  modifyNumber: function (token, id, num, keys) {
    wx.request({
      url: config.config.postModifyGiftNum,
      data: {
        token: token,
        id: id,
        num: num,
        keys: keys
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var ordersPay = res.data.bean.ordersPay
          var itemList = res.data.bean.itemList
          // 检查是否有海淘产品
          var isSeaAmoy = false
          for (var i in itemList) {
            if (itemList[i].isSeaAmoy == 1) {
              isSeaAmoy = true
            }
          }
          this.setData({
            isSeaAmoy: isSeaAmoy
          })
          var itemListsub = itemList.splice(0, 3)
          var total = res.data.bean.number
          this.setData({
            ordersPay: ordersPay,
            total: total,
            rows: res.data.total,
            reduceCoupon: res.data.bean.reduceCoupon,
            reducePrice: res.data.bean.reducePrice,
            productPrice: res.data.bean.productPrice,
            priceSplit: res.data.bean.priceSplit
          })
          console.log(num)
          if (num == 0) {
            this.setData({
              itemList: itemListsub
            })
            var param = {}
            for (var i in itemListsub) {
              param.propName = JSON.parse(itemListsub[i].productParamText).propName
              this.setData({
                ['itemList[' + i + '].productParamText']: param
              })
            }
          }
          if (res.data.total > 3) {
            this.setData({
              isShowAll: true
            })
          } else {
            this.setData({
              isShowAll: false
            })
          }
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.modifyNumber)
          utils.getUserInfoFun(this.modifyNumber, this)
        }
      }
    })
  },
  addNumber: function (e) {
    var index = e.currentTarget.dataset.index
    this.data.itemList[index].num++
    this.setData({
      itemList: this.data.itemList
    })
    var id = this.data.itemList[index].id
    var num = this.data.itemList[index].num
    var token = this.data.token
    // 修改数量接口
    this.modifyNumber(token, id, num, this.data.groupnumber)
  },
  reduceNumber: function (e) {
    var index = e.currentTarget.dataset.index
    // if (this.data.itemList[index].num != 1) {
    this.data.itemList[index].num--
    // }
    this.setData({
      itemList: this.data.itemList
    })
    var id = this.data.itemList[index].id
    var num = this.data.itemList[index].num
    var token = this.data.token
    // 修改数量接口
    this.modifyNumber(token, id, num, this.data.groupnumber)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.selectedImg) {
      this.setData({
        selectedImg: options.selectedImg
      })
      wx.setStorageSync('selectedImg', options.selectedImg)
    } else {
      this.setData({
        selectedImg: ''
      })
    }
  },
  /**
   * 获取购物车商品数量
   */
  getGoodsNum: function () {
    if (this.data.isLogin) {
      wx.request({
        url: config.config.getShoppingCarNumber,
        data: {
          token: this.data.token
        },
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            if (res.data.bean != 0) {
              this.setData({
                goodsNumber: res.data.bean
              })
            } else {
              this.setData({
                goodsNumber: ''
              })
            }
          } else if (res.data.status == 801) {
            // this.getUserInfoFun(this.getGoodsNum)
            utils.getUserInfoFun(this.getGoodsNum, this)
          }
        }
      })
    }
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
    var tabsindexs = wx.getStorageSync("tabsindexs") || 1
    var current = wx.getStorageSync('current') || 7
    this.setData({
      current: current,
      canClickSendBtn: true,
      tabsindexs: tabsindexs
    })
    if (current == 1) {
      setTimeout(() => {
        this.setData({
          showMessage: true
        })
      }, 300)
    }
    if (current == 5) {
      this.setData({
        groupnumber: this.data.peopleArr[this.data.peopleindex]
      })
    }
    var remarks = wx.getStorageSync('remarks') || ''
    this.setData({
      remarks: remarks
    })

    var remarksGroup = wx.getStorageSync("remarksGroup") || ''
    this.setData({
      remarksGroup: remarksGroup
    })

    var remarksDice = wx.getStorageSync("remarksDice") || ''
    this.setData({
      remarksDice: remarksDice
    })
    var remarksDirect = wx.getStorageSync("remarksDirect") || ''
    this.setData({
      remarksDirect: remarksDirect
    })
    var currentkey = wx.getStorageSync("currentkey") || '1'
    this.setData({
      currentkey: currentkey
    })

    var currentnumber = wx.getStorageSync("currentnumber") || '1'
    this.setData({
      currentnumber: currentnumber
    })

    var idcardNumber = wx.getStorageSync("idcardNumber") || ''
    this.setData({
      idcardNumber: idcardNumber
    })

    var selectedImg = wx.getStorageSync("selectedImg") || ''
    this.setData({
      selectedImg: selectedImg
    })
    var groupnumber = wx.getStorageSync("groupnumber") || 4
    var peopleindex = wx.getStorageSync("peopleindex") || 2
    this.setData({
      groupnumber: groupnumber,
      peopleindex: peopleindex
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (res.data) {
          this.setData({
            token: res.data
          })
        }
        this.getGiftCar(this.data.groupnumber)
        this.getGoodsNum()
        if (app.globalData.userPhone) {
          this.setData({
            userPhone: app.globalData.userPhone,
            hasUserPhone: true
          })
        } else {
          this.getUserPhone()
        }
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  /**
   * 选择图片
   */
  selectPicture: function () {
    wx.navigateTo({
      url: '/pages/gallery/gallery'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '解锁送礼新玩法 嗨翻你的朋友圈',
      imageUrl: 'https://image.prise.shop/images/2018/07/20/1532078497812763.jpg'
    }
  },
})
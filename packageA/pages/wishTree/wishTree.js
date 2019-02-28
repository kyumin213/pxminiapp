// packageA/pages/wishTree/wishTree.js
const app = getApp()
const utils = require('../../../utils/util.js')
var config = require('../../../utils/config.js')
const Puzzle = require("../../../utils/h5puzzle.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends: [],
    showFriendList: false,
    step1: true,
    step2: false,
    step3: false,
    i: 0,
    beforeReceive: true,
    energyValue: 2000,
    w1: false,
    imgUrl: 'https://image.prise.shop/images/2018/07/10/1531208943280260.jpg',
    limitedTime: 30,
    sessionName: ["", "树苗期", "成长期", "大树期", "开花期", "结果期"],
    bgModeDefault: ["", "bg-shumiao", "bg-growup", "bg-tree", "bg-flowers", "bg-fruit", "bg-fruit"],
    bgModeX: ["", "bg-shumiao-x", "bg-growup-x", "bg-tree-x", "bg-flowers-x", "bg-fruit-x", "bg-fruit-x"],
    progressBarWidth: 0,
    leftRotate: -135,
    rightRotate: -135,
    // treeFriendList: [],
    showRankPop: true,
    showToolsInfo: false,
    showBottomMenu: true,
    rankOrdersName: ["", "第一名", "第二名", "第三名", "第四名", "第五名", "第六名", "第七名", "第八名", "第九名", "第十名"],
    timeTool: 1,
    showNotice: true,
    showUseInfo: 0
  },
  onReady: function () {
    this.animation = wx.createAnimation()
  },
  /**
   * 点击道具
   */
  bindClickTool: function () {
    utils.httpRequestGet(config.config.getUserToolList, {token: this.data.token}, (res) => {
      if (res.data.status == 200) {
        this.setData({
          showToolsInfo: !this.data.showToolsInfo,
          showBottomMenu: !this.data.showBottomMenu,
          tools: res.data.bean
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.bindClickTool, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })    
  },
  closeTimeTool: function () {
    this.setData({
      showToolsInfo: !this.data.showToolsInfo,
      showBottomMenu: !this.data.showBottomMenu
    })
  },
  /**
   * 查看道具说明
   */
  showToolInfo: function (e) {
    var index = e.currentTarget.dataset.index
    var toolDescribe = this.data.tools[index].toolDescribe
    // 缩小其他放大图片
    for (var i in this.data.tools) {
      this.setData({
        ['tools[' + i + '].showUseInfo']: false,
      })
    }
    this.setData({
      showToolDescribe: true,
      ['tools[' + index +'].showUseInfo']: true,
      toolDescribe: toolDescribe
    })
  },
  hideToolInfo: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      showToolDescribe: false,
      ['tools[' + index + '].showUseInfo']: false
    })
  },
  gotoWelfare: function () {
    wx.navigateTo({
      url: '/packageA/pages/welfare/welfare?current=1',
    })
  },
  gotoWelfarePop: function () {
    wx.navigateTo({
      url: '/packageA/pages/welfare/welfare?current=2',
    })
  },
  gotoPersonal: function () {
    wx.navigateTo({
      url: '/pages/me/me',
    })
  },
  // 关闭每个时期弹框
  toggleTreePop: function () {
    this.setData({
      isShowPop: false
    })
  },
  // 领取奖励
  bindClickGetReward: function () { 
    this.judgeRewardInfo()
  },
  /**
   *  判断是实物奖励还是能量奖励
   *  0:能量奖励 1:有实物奖励
   */
  judgeRewardInfo: function () {
    utils.httpRequestGet(config.config.getRankWinnerInfo, {token: this.data.token}, (res) => {
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
    utils.httpRequestPost(config.config.postRankWinnerEnergy, {token: this.data.token}, (res) => {
      if (res.data.status == 200) {
        this.setData({
          rankReward: false
        })
        // 更新许愿树
        this.getWishTree()
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
   * 返回钱包页面
   */
  gotoWallent: function () {
    wx.navigateTo({
      url: '/pages/wallet/wallet',
    })
  },
  /**
   * 去许愿页面
   */
  goWishing: function () {
    wx.navigateTo({
      url: '/packageA/pages/wishing/wishing',
    })
  },
  // 果实掉落 重新许愿
  gotoWishing: function () {
    wx.request({
      url: config.config.postAfreshTree,
      data: {
        id: this.data.treeId,
        token: this.data.token
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if(res.data.status == 200) {
          wx.reLaunch({
            url: '/packageA/pages/wishing/wishing',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.gotoWishing, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  // 收获果实阶段弹框关闭
  toggleGainsPop: function () {    
    // 获取礼品名称信息
    wx.request({
      url: config.config.getFruitName,
      data: {
        promiseId: this.data.promiseId,
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // 显示产品图片 隐藏收获弹窗
          this.setData({
            giftPictureCover: res.data.bean.giftPictureCover,
            giftTitle: res.data.bean.giftTitle,
            showGifts: true,
            isShowPop: false,
            promiseType: res.data.bean.promiseType
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.toggleGainsPop, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 收获红包果实
   */
  bindReceiveMoney: function () {
    utils.httpRequestPost(config.config.postSubmitMoneyFruit, 
      { token: this.data.token, treeId: this.data.treeId },
      (res) => {
        if (res.data.status == 200) {
          this.setData({
            isGetMoneySuccess: true,
            showAddress: false
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.bindReceiveMoney, this)
        } else {
          utils.showTips(res.data.msg)
        }
      })
  },
  // 点击获取礼物按钮 弹出地址框
  popAddressBox: function() {
    // 显示地址弹框
    this.setData({
      showAddress: true
    })  
  },
  toggleGainbox: function () {
    this.setData({
      showAddress: !this.data.showAddress
    })
  },
  // 查看攻略
  gotoStrategy: function () {
    if (this.data.isNew == false || this.data.isNew == 'false') {
      wx.navigateTo({
        url: '/packageA/pages/strategy/strategy',
      })
    }
  },
  /**
   * 查看已选愿望
   */
  checkMyPromise: function () {
    // 获取礼品名称信息
    wx.request({
      url: config.config.getFruitName,
      data: {
        promiseId: this.data.promiseId,
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            showPromise: true,
            giftTitle: res.data.bean.giftTitle
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.checkMyPromise, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 重新选择
   */
  chooseSelect: function () {
    this.setData({
      showPromise: false,
      selectAgain: true
    })
  },
  /**
   * 取消
   */
  chooseCancel: function () {
    this.setData({
      showPromise: false
    })
  },
  closePopAgain: function () {
    this.setData({
      selectAgain: false
    })
  },
  /**
   * 收集已产生的能量
   */
  getEnergy: function (e) {
    var formId = e.detail.formId
    this.setData({ formId: formId})
    var growthStageBefore = this.data.growthStage
    utils.httpRequestPost(
      config.config.postGatherEnergy, 
      { token: this.data.token, id: this.data.treeId, formId: this.data.formId }, 
      (res) => {
        if (res.data.status == 200) {
          // 开始动画        
          this.setData({
            showEnergy: true,
            newerTip: false
          })
          var addEnergyValue = Math.floor(this.data.gatherValue * this.data.radicesValue).toFixed(0)
          var defaultValue = this.data.growthValue
          setTimeout(() => {
            this.setData({
              growthValue: this.data.growthValue + 2,
              addEnergyValue: addEnergyValue
            })
          }, 1200)
          setTimeout(() => {
            this.setData({
              growthValue: this.data.growthValue - 1
            })
          }, 1300)
          setTimeout(() => {
            this.setData({
              growthValue: this.data.growthValue + 2
            })
          }, 1400)
          setTimeout(() => {
            this.setData({
              growthValue: Math.floor(defaultValue + this.data.gatherValue * this.data.radicesValue).toFixed(0)
            })
            // 更新许愿树
            this.getWishTree()
          }, 1500)
          setTimeout(() => {
            // 未刷新页面一直增长能量实现几个阶段跳跃 每新跳一个阶段把显示弹框isShowPop恢复为true
            var growthStageNow = this.data.growthStage
            if (growthStageNow > growthStageBefore) {
              this.setData({
                isShowPop: true
              })
            }
          }, 2000)
          setTimeout(() => {
            this.setData({
              showEnergy: false
            })
          }, 3000)
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getEnergy, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    )
  },
  /**
   * 收集能量 显示游戏面板
   */
  showGamePanel: function () {
    if (this.data.isNew == false || this.data.isNew == 'false') {
      this.setData({
        showGamePanel: true,
        surprisePopFail: false
      })
    }    
  },
  /**
   * 关闭游戏面板
   */
  closeGamePanel: function () {
    this.setData({
      showGamePanel: false
    })
  },
  /**
   * 玩游戏 收集能量 拼图
   */
  startPintuGame: function () {
    // 隐藏领取惊喜红包失败的弹框 surprisePopFail
    this.setData({
      showGifts: false,
      surprisePopFail: false,
      showGamePanel: false
    })
    if (this.data.isNew == false || this.data.isNew == 'false') {
      if (this.data.isLogin) {
        // 获取拼图详情
        wx.request({
          url: config.config.getTreeGameInfo,
          data: {
            token: this.data.token,
            treeId: this.data.treeId
          },
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            if (res.data.status == 200) {
              // 显示弹框
              if (res.data.bean.chances > 0) {
                // 判断是否在第一大关第一小关
                if (res.data.bean.parentOrders == 1 && res.data.bean.childOrders == 1) {
                  this.setData({
                    firstGame: true,
                    isGameStart: true,
                    chances: res.data.bean.chances
                  })
                } else {
                  this.setData({
                    isGameStart: true,
                    chances: res.data.bean.chances,
                    firstGame: false,
                  })
                } 
              } else {
                this.setData({
                  noChance: true
                })
              }              
            } else if (res.data.status == 801) {
              utils.getUserInfoFun(this.startPintuGame, this)
            } else {
              utils.showTips(res.data.msg)
            }
          }
        })   
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }         
    }
  },
  /**
   * 参与答题游戏
   */
  joinAnswerGame: function () {
    if (this.data.isLogin) {
      // 获取机会数
      utils.httpRequestGet(config.config.getAnswerGameDetails, { token: this.data.token, treeId: this.data.treeId}, 
      (res) => {
        if (res.data.status == 200) {
          if (res.data.bean.chances > 0) {
            this.setData({
              isAnswerGameStart: true,
              showGamePanel: false,
              answerChances: res.data.bean.chances,
              qustionNumber: res.data.bean.answerNumber
            })
          } else {
            this.setData({
              noAnswerChance: true,
              showGamePanel: false,
            })
          }          
        }
      })      
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 开始答题
   */
  startAnswerGame: function () {
    utils.httpRequestPost(config.config.postJoinTreeAnswer, { token: this.data.token, treeId: this.data.treeId }, 
    (res) => {
      if (res.data.status == 200) {
        this.setData({
          isAnswerGameStart: false,
          reward: res.data.bean.reward
        })
        wx.navigateTo({
          url: '/packageA/pages/answerGame/answerGame?qustionNumber=' + this.data.qustionNumber + '&treeId=' + this.data.treeId + '&treeUserId=' + this.data.treeUserId + '&limitedChance=' + this.data.answerChances + '&reward=' + res.data.bean.reward,
        }) 
      } else if (res.data.status == 801){
        utils.getUserInfoFun(this.startAnswerGame, this)
      } else {
        utils.showTips('服务器错误')
      }
    })
  },
  // 返回许愿池
  gobackWishing: function () {
    clearInterval(this.data.gameTimer)    
    this.setData({
      isGameStart: false,
      showFail: false,
      showSuccess: false,
      noChance: false,
      isStarted: false,
      gameTime: 0,
      limitedTime: 0,
      isPassAll: false,
      gameOver: false,
      isAnswerGameStart: false,
      noAnswerChance: false
    })
    this.getWishTree()
  },
  /**
   * 调用开始拼图接口
   */
  joinGame: function () {
    wx.request({
      url: config.config.postJoinTreeGame,
      data: {
        token: this.data.token,
        treeId: this.data.treeId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            jigsawPicture: res.data.bean.jigsawPicture,
            pictureSplit: res.data.bean.pictureSplit,
            isGameStart: false,
            isStarted: true,
            countClick: 0,
            limitedTime: res.data.bean.limitTime,
            gameTime: 0,
            gameOver: false,
            defaultGameTime: res.data.bean.limitTime,
            showConfirmBox: false            
          })
          var minutes = this.addNumber(Math.floor(this.data.limitedTime / 60 % 60));
          var seconds = this.addNumber(Math.floor(this.data.limitedTime % 60));
          this.setData({
            minutes: minutes,
            seconds: seconds
          })
          // 拼图初始化
          new Puzzle(this, {
            type: this.data.pictureSplit
          });
          setTimeout(() => {
            // 开始计时 两个计时器
            // this.submitTime()
            clearInterval(this.data.gameTimer)
            this.changeTime(0, this.data.limitedTime)
          }, 500)
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
   * 调用查看道具数量接口
   */
  getTimeTool: function () {
    utils.httpRequestGet(config.config.getMyTimeTool, {token: this.data.token}, (res) => {
      if (res.data.status == 200) {
        this.setData({
          toolNum: res.data.bean.toolNum,
          toolId: res.data.bean.id
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getTimeTool, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  // 进入拼图游戏
  startChanllenge: function () {
    if (this.data.chances > 0) {
      this.IsFirstTimeJoin()
      this.joinGame()
      this.getTimeTool()
    } else {
      // 显示没有机会弹框
      this.setData({
        noChance: true
      })
    } 
  },
  /**
   * 点击重新闯关按钮
   */
  bindClickAgain: function () {
    this.setData({
      showConfirmBox: true,
      isGameStart: false
    })
  },
  /**
   * 选择重新闯关
   */
  goAfreshGame: function () {
    this.setData({
      showConfirmBox: false
    })
    wx.request({
      url: config.config.postAfreshGame,
      data: {
        token: this.data.token,
        treeId: this.data.treeId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean.chances > 0) {
            // 调用参加游戏接口
            this.joinGame()
            this.getTimeTool()
          } else {
            this.setData({
              noChance: true
            })
          }
        }
      }
    })
  },
  /**
   * 首次玩游戏接口
   */
  IsFirstTimeJoin: function () {
    wx.request({
      url: config.config.postIsFirstTimeJoin,
      data: {
        token: this.data.token
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.IsFirstTimeJoin, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 继续挑战
   */
  goContinue: function () {
    // todo 检测是否还有挑战机会 没有的话弹框
    if (this.data.chances > 0) {
      this.setData({
        gameOver: false,
        isGameStart: false,
        isStarted: true,
        countClick: 0,
        showSuccess: false,
        showFail: false,
        isPassAll: false,
        gameTime: 0
      })
      this.joinGame()    
      this.getTimeTool()  
    } else {
      // 显示没有机会弹框
      this.setData({
        noChance: true,
        showFail: false,
        showSuccess: false
      })
    } 
  },
  /**
   * 提交挑战失败接口
   */
  submitFailChanllenge: function () {
    wx.request({
      url: config.config.postFailGame,
      data: {
        token: this.data.token,
        treeId: this.data.treeId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            showFail: true,
            chances: res.data.bean.chances
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitFailChanllenge, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 提交挑战成功接口
   */
  submitSuccessChanllenge: function () {
    wx.request({
      url: config.config.postSuccessGame,
      data: {
        token: this.data.token,
        treeId: this.data.treeId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            showSuccess: true,
            chances: res.data.bean.chances,
            newEnergy: res.data.bean.growthValue
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitSuccessChanllenge, this)
        } else if (res.data.status == 202) {
          // 通关
          this.setData({
            isPassAll: true,
            chances: res.data.bean.chances,
            newEnergy: res.data.bean.growthValue
          })
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 查看原图
   */
  checkDefaultImg: function () {
    // 每加20s次数加1
    this.data.countClick++
    console.log(this.data.countClick)
    // 有道具卡 消耗道具卡
    if (this.data.toolNum > 0) {
      // 调用消耗时间卡接口
      utils.httpRequestPost(config.config.postConsumeTools, { token: this.data.token, id: this.data.toolId }, (res) => {
        if (res.data.status == 200) {
          this.setData({
            toolNum: res.data.bean
          })
          var gameTime = this.data.gameTime - 5
          var limitedTime = this.data.limitedTime + 5
          // 如果加20s没有时间了 直接结束
          if (limitedTime < 1) {
            this.stopGame()
            this.setData({
              // showFail: true,
              isStarted: false
            })
            this.submitFailChanllenge() //提交失败 显示提示
            return false
          }
          this.setData({
            gameTime: gameTime,
            limitedTime: limitedTime
          })
          // 加20s后开始计时
          clearInterval(this.data.gameTimer)
          this.changeTime(gameTime, this.data.limitedTime)
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
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.consumeTimeTool, this)
        } else {
          utils.showTips(res.data.msg)
        }
      })      
    } else {
      // 加10s 清除原来的定时器 重新开始计时
      var gameTime = this.data.gameTime + 5
      var limitedTime = this.data.limitedTime - 5
      // 如果加20s没有时间了 直接结束
      if (limitedTime < 1) {
        this.stopGame()
        this.setData({
          isStarted: false
        })
        this.submitFailChanllenge() //提交失败 显示提示
        return false
      }
      this.setData({
        gameTime: gameTime,
        limitedTime: limitedTime
      })
      // 加20s后开始计时
      clearInterval(this.data.gameTimer)
      this.changeTime(gameTime, this.data.limitedTime)
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
    }        
  },
  /**
   * 提交时间的计时(已停止使用)
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
          // mins: ss[1]
        })
        clearInterval(misTimer)
      }
    }, 10)
  },
  /**
   * 计时
   */
  changeTime: function (gameTime,limitedTime) {
    clearInterval(this.data.gameTimer)
    this.data.gameTimer = setInterval(() => {
      // if (gameTime < limitedTime) {
      if (0 < limitedTime) {
        if (!this.data.gameOver) {
          gameTime = gameTime + 1
          // var minutes = this.addNumber(Math.floor(gameTime / 60 % 60));
          // var seconds = this.addNumber(Math.floor(gameTime % 60));
          limitedTime = limitedTime - 1
          var minutes = this.addNumber(Math.floor(limitedTime / 60 % 60));
          var seconds = this.addNumber(Math.floor(limitedTime % 60));
          this.setData({
            minutes: minutes,
            seconds: seconds,
            gameTime: gameTime,
            limitedTime: limitedTime
          })
        } else {          
          // 拼图完成 清除定时器 记录总时间 跳转完成页面 调用拼图完成接口
          // 2019.1.7 总耗时 = 总时间 - 剩余时间
          var totalTime = this.data.defaultGameTime - this.data.limitedTime
          var mm = this.addNumber(parseInt((totalTime % (1000 * 60 * 60)) / (1000 * 60)))
          var ss = this.addNumber(totalTime % 60)
          this.setData({
            totalTime: totalTime,
            mm: mm,
            ss: ss
          })
          clearInterval(this.data.gameTimer)
          this.setData({
            isStarted: false,
          })
          setTimeout(()=>{
            this.submitSuccessChanllenge() //提交成功 显示提示
          },100)
        }
      } else {
        // 停止拼图 时间截止
        this.stopGame()
        this.setData({
          isStarted: false
        })
        setTimeout(() => {
          this.submitFailChanllenge() //提交失败 显示提示        
        }, 100)
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
    return numArr;
  },
  
  /**
   * 拼图完成 提交时间
   */
  submitGameTime: function () {
    wx.request({
      url: config.config.postPintuTime,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        consumeTime: this.data.totalTime,
        notifyFormId: this.data.formId
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
          // 刷新拼图页面信息
          // this.getPintuCard()
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
  /**
   * 关闭机会用完弹框
   */
  closeTipDialog: function () {
    this.setData({
      noChance: false,
      showFail: false
    })
    // 刷新拼图页面信息
    this.getWishTree()
  },
  /**
   * 拼图 结束游戏 放弃挑战
   */
  stopGame: function () {
    clearInterval(this.data.gameTimer)
    this.setData({
      isStarted: false,
      gameTime: 0,
      limitedTime: 0,
      gameOver: true
    })
    // 刷新拼图页面信息
    this.getWishTree()
  },
  /**
   * 浇水
   */ 
  submitWatering: function () {
    this.setData({
      showGifts: false
    })
    if (this.data.isNew == false || this.data.isNew == 'false') {
      if (this.data.isLogin) {
        if (!this.data.isWatering) {
          wx.request({
            url: config.config.postTreeWatering,
            data: {
              token: this.data.token,
              id: this.data.treeId
            },
            method: 'POST',
            dataType: 'json',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
              if (res.data.status == 200) {
                // 设置浇水之后增加的倍数
                this.setData({
                  wateringTimes: res.data.bean
                })
                // 显示浇水动画
                this.setData({
                  isWatering: true
                })
                setTimeout(() => {
                  // 更新许愿树信息
                  this.getWishTree()
                }, 3600)
                // 5s后继续隐藏浇水动画信息 等待下一次浇水动画生成
                setTimeout(() => {
                  this.setData({
                    isWatering: false
                  })
                }, 5500)
              } else if (res.data.status == 801) {
                utils.getUserInfoFun(this.submitWatering, this)
              } else if (res.data.status == 201) {
                // 浇水次数用完 显示弹框 许愿树总共被浇水10次
                this.setData({
                  noWaterChanceTotal: true
                })
              } else if (res.data.status == 202 || res.data.status == 203) {
                // 浇水次数用完 显示弹框 给自己2次 给他人4次
                this.setData({
                  noWaterChance: true
                })
              } else {
                utils.showTips(res.data.msg)
              }
            }
          })
        }        
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }      
    }    
  },
  // 关闭浇水次数用完弹框
  closeNoWaterChance: function () {
    this.setData({
      noWaterChance: false,
      noWaterChanceTotal: false,
      noTree: false
    })
  },
  // 新手指引 下一步
  gotoNext: function () {
    var i = ++this.data.i
    this.setData({
      i: i
    })
    if (i == 1) {
      this.setData({
        step1: false,
        step2: true,
        step3: false
      })
    }
    if (i == 2) {
      this.setData({
        step1: false,
        step2: false,
        step3: true,
      })
    }
  },
  // 结束指引开启许愿树
  closeGuide: function () {
    this.setData({
      step1: false,
      step2: false,
      step3: false,
      isNew: false,
      hasEnergy: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setBackgroundColor({
    //   backgroundColor: '#a7c666', 
    // })
    var isNew = options.isNew || false
    this.setData({
      isNew: isNew
    })
    if (this.data.isNew == true || this.data.isNew == 'true') {
      this.setData({
        newerTip: true
      })
    } 
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.toLowerCase().indexOf('iphone x') > -1) {
          this.setData({
            iphonex: true
          })
        }
      }
    })
    // 隐藏放假通知
    setTimeout(() => {
      this.setData({
        taskShow: false,
        showNotice: false
      })
    }, 18000)
  },
  /**
   * 查看是否有惊喜红包
   */
  getHasSurprise: function () {
    utils.httpRequestGet(config.config.getHasSurprise, {token: this.data.token}, (res) => {
      if (res.data.status == 200) {
        this.setData({
          surprisePrice: res.data.bean.surprisePrice,
          surpriseId: res.data.bean.surpriseId,
          consumeValue: res.data.bean.consumeValue,
          showRedEnvelopes: true,
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getHasSurprise, this)
      } else {
        this.setData({
          showRedEnvelopes: false
        })
      }
    })
  },  
  /**
   * 领取惊喜红包
   */
  submitSurprise: function () {
    utils.httpRequestPost(config.config.postReceiveSurprise, 
      { token: this.data.token, surpriseId: this.data.surpriseId}, 
      (res) => {
        if (res.data.status == 200) {
          this.setData({
            surprisePopSuccess: true,
            hasRedEnvelopes: false
          })
        } else if (res.data.status == 202) {
          this.setData({
            surprisePopFail: true,
            hasRedEnvelopes: false
          })
        } else if(res.data.status == 203) {
          this.setData({
            surprisePopSuccessNo: true,
            hasRedEnvelopes: false
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitSurprise, this)
        } 
      })
  },
  /**
   * 打开惊喜红包弹框
   */
  bindClickSurprise: function () {
    this.setData({
      hasRedEnvelopes: true,
      showRedEnvelopes: false
    })
  },
  /**
   * 关闭惊喜红包弹框
   */
  closeSurprisePop: function () {
    this.setData({
      hasRedEnvelopes: false,
      surprisePopFail: false,
      surprisePopSuccessNo: false,
      surprisePopSuccess: false
    })
    this.getHasSurprise()
    this.getWishTree()
  },
  /**
   * 获取许愿树信息
   */
  getWishTree: function () {
    wx.request({
      url: config.config.getWishTreeInfo,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: this.data.token
      },
      success: (res) => {
        if (res.data.status == 200) {
          // console.log('getWishTree')
          wx.stopPullDownRefresh()
          this.setData({
            promiseTree: res.data.bean.promiseTree || {},
            radicesValue: res.data.bean.radicesValue,
            waterMyself: res.data.bean.waterMyself || '0/2',
            gatherValue: res.data.bean.gatherValue || 0,
            waterFriends: res.data.bean.waterFriends || '4/4',
            treeId: res.data.bean.promiseTree.id,
            userId: res.data.bean.promiseTree.userId,
            growthValue: res.data.bean.promiseTree.growthValue,
            matureValue: res.data.bean.promiseTree.matureValue,
            growthStage: res.data.bean.promiseTree.growthStage,
            isLoading: true,
            treeUserId: res.data.bean.promiseTree.userId,
            promiseId: res.data.bean.promiseTree.promiseId,
            giftPictureCover: res.data.bean.giftPictureCover,
            defaultPage: 1,
            rankReward: res.data.bean.rankReward,
            rankOrders: res.data.bean.rankOrders || '',
            taskShow: res.data.bean.taskShow
          })
          if (!this.data.iphonex) {
            this.setData({
              bgMode: this.data.bgModeDefault[this.data.growthStage]
            })            
          } else {
            this.setData({
              bgMode: this.data.bgModeX[this.data.growthStage]
            })
          }
          var progressBarWidth = this.data.growthValue / this.data.matureValue * 100
          this.setData({
            progressBarWidth: progressBarWidth + '%'
          })
          if (this.data.growthValue / this.data.matureValue <= 0.5) {
            var rightRotate = -135 + this.data.growthValue / this.data.matureValue * 360
            var leftRotate = -135
          } else {
            var leftRotate = -135 + this.data.growthValue / this.data.matureValue * 180
            var rightRotate = 45
          }
          this.setData({
            rightRotate: rightRotate,
            leftRotate: leftRotate
          })
          // 结果期获取地址 获取分享图片及文案
          if (this.data.growthStage == 5) {
            this.setData({
              isShowPop: true
            })            
            this.getShowSharePic()
          }
          this.getUserAddress()
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getWishTree, this)
        } else {
          // utils.showTips(res.data.msg)
          wx.redirectTo({
            url: '/packageA/pages/wishing/wishing',
          })
          this.setData({
            isLoading: true
          })
        }
      }
    })
  },
  /**
   * 获取许愿树好友列表
   */
  getTreeFriends: function () {
    wx.request({
      url: config.config.getTreeFriends,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: this.data.token,
        pageBegin: this.data.defaultPage
      },
      success: (res) => {
        this.setData({
          isLoadingFriends: true
        })
        if (res.data.status == 200) {
          if (res.data.bean) {
            this.setData({
              treeFriendList: res.data.bean.treeFriendList || [],
              waterFriends: res.data.bean.waterFriends,
              total: res.data.total
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getTreeFriends, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  scrollTreeFriends: function (pageBegin) {
    wx.request({
      url: config.config.getTreeFriends,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: this.data.token,
        pageBegin: pageBegin
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean) {
            this.setData({
              waterFriends: res.data.bean.waterFriends,
              // total: res.data.total
            })
            var scrollTreeFriendList = res.data.bean.treeFriendList
            var tempArray = this.data.treeFriendList
            tempArray = tempArray.concat(scrollTreeFriendList)
            this.setData({
              treeFriendList: tempArray
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.scrollTreeFriends, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 排行榜触底事件
   */
  lower: function (e) {
    if (this.data.total > this.data.treeFriendList.length) {
      ++this.data.defaultPage
      this.setData({
        defaultPage: this.data.defaultPage
      })
      this.scrollTreeFriends(this.data.defaultPage)
    }
  },
  /**
   * 判断好友是否有许愿树
   */
  judgeIsHasTree: function (e) {
    var index = e.currentTarget.dataset.index
    var treeUserId = this.data.treeFriendList[index].fromUserId
    wx.request({
      url: config.config.getIsFriendsHasTree,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: this.data.token,
        treeUserId: treeUserId
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean == 1) {
            // 去到好友的许愿树 1有树 0 没树
            wx.navigateTo({
              url: '/packageA/pages/watering/watering?treeUserId=' + treeUserId,
            })
          } else {
            this.setData({              
              showFriendList: false,
              noTree: true
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.judgeIsHasTree, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })    
  },
  // 好友列表弹框切换
  toggleFriendsDialog: function () {
    this.setData({
      showFriendList: !this.data.showFriendList,
      defaultPage: 1
    })
    if (this.data.showFriendList) {
      this.getTreeFriends()
    } 
  },
  toggleRankDialog: function () {
    this.setData({
      rankReward: false
    })
    wx.navigateTo({
      url: '/packageA/pages/rankList/rankList',
    })
  },
  checkLastRank: function () {
    wx.navigateTo({
      url: '/packageA/pages/lastWeekRank/lastWeekRank',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync("token") || "paixi_123"
    var isLogin = wx.getStorageSync("isLogin") || false
    this.setData({
      token: token,
      isLogin: isLogin
    })
    // 获取许愿树信息
    this.getWishTree()    
    // 查看是否有惊喜红包
    this.getHasSurprise()
    
  },
  /**
   * 收货果实 填写地址直接弹出微信默认地址
   */
  getGifts: function () {
    this.setData({
      showAddress: false
    })
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
                          _this.submitTreeAddress()
                        } else {
                          console.log('用户点击返回修改')
                          _this.getGifts()
                        }
                      })
                    } else if (res.data.status == 801) {
                      utils.getUserInfoFun(_this.getGifts, _this)
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
                          _this.submitTreeAddress()
                        } else {
                          console.log('用户点击返回修改')
                          _this.getGifts()
                        }
                      })
                    } else if (res.data.status == 801) {
                      utils.getUserInfoFun(_this.getGifts, _this)
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
   * 收获果实 提交地址接口
   */
  submitTreeAddress: function () {
    wx.request({
      url: config.config.postWishTreeAddress,
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
          // utils.showTips('领取成功')
          wx.reLaunch({
            url: '/packageA/pages/treeSuccess/treeSuccess',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitTreeAddress, this)
        } else if (res.data.status == 503) {
          utils.showTips(res.data.msg)
        }
      }
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
        } else if(res.data.status == 801) {
          utils.getUserInfoFun(this.getUserAddress, this)
        } else {
          this.setData({
            hasAddress: false
          })
        }
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      showGifts: false,
      showAddress: false
    })
    this.getWishTree()     
    this.getHasSurprise()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showGifts: false,
      showAddress: false,
      taskShow: false,
      showNotice: false
    })
  },
  /**
   * 判断首次分享浇水
   */
  isFirstTimeShare: function () {
    wx.request({
      url: config.config.postIsFirstTimeShare,
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: this.data.token
      },
      success: (res) => {
        if (res.data.status == 200) {
          
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.isFirstTimeShare, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 获取炫耀分享图片 showShare
   */
  getShowSharePic: function () {
    wx.request({
      url: config.config.getSharePic,
      data: {
        configKey: 'showShare',
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            sharePic: res.data.bean.configValue || 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20181129032025726920109.png',
            shareText: res.data.bean.description || '炫耀分享'
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from == "button") {
      if (res.target.id == 'shareHelp') {
        return {
          title: '@你,我的挑战机会用完了，求新的挑战机会~',
          path: '/packageA/pages/treeGameHelp/treeGameHelp?treeId=' + this.data.treeId + '&treeUserId=' + this.data.treeUserId,
          imageUrl: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20181127101839532548148.png'
        }
      } else if (res.target.id == 'shareWatering') {
        this.isFirstTimeShare()
        return {
          title: '@你,快来我的许愿树浇水帮我实现愿望吧～',
          path: '/packageA/pages/watering/watering?treeUserId=' + this.data.treeUserId,
          imageUrl: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20181127101842699764221.png'
        }
      } else if (res.target.id == 'showFriend') {
        return {
          title: this.data.shareText,
          path: '/packageA/pages/showOff/showOff?giftTitle=' + this.data.giftTitle + '&treeUserId=' + this.data.treeUserId,
          imageUrl: this.data.sharePic
        }
      } else if (res.target.id == 'answerHelp') {
        return {
          title: '@你,我的挑战机会用完了，求新的挑战机会~',
          path: '/packageA/pages/answerGameHelp/answerGameHelp?treeId=' + this.data.treeId + '&treeUserId=' + this.data.treeUserId,
          imageUrl: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190227023733902438367.jpg'
        }
      }
    }    
    this.isFirstTimeShare()
    return {
      title: '@你,快来我的许愿树浇水帮我实现愿望吧～',
      path: '/packageA/pages/watering/watering?treeUserId=' + this.data.treeUserId,
      imageUrl: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20181127101842699764221.png'
    }
  }
})
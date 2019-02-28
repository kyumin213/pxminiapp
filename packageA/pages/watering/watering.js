// packageA/pages/wishTree/wishTree.js
const app = getApp()
const utils = require('../../../utils/util.js')
var config = require('../../../utils/config.js')
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
    // hasEnergy: true, //暂时
    energyValue: 2000,
    w1: false,
    isShowPop: true,
    imgUrl: 'https://image.prise.shop/images/2018/07/10/1531208943280260.jpg',
    limitedTime: 30,
    sessionName: ["", "树苗期", "成长期", "大树期", "开花期", "结果期"],
    bgModeDefault: ["notree-bg", "bg-shumiao", "bg-growup", "bg-tree", "bg-flowers", "bg-fruit", "bg-fruit", "bg-fruit"],
    bgModeX: ["notree-bg-x", "bg-shumiao-x", "bg-growup-x", "bg-tree-x", "bg-flowers-x", "bg-fruit-x", "bg-fruit-x", "bg-fruit-x"],
    progressBarWidth: 0,
    leftRotate: -135,
    rightRotate: -135,
    canWatering: true
  },
  onReady: function () {
    // this.animation = wx.createAnimation()
  },
  gotoPersonal: function () {
    wx.navigateTo({
      url: '/pages/me/me',
    })
  },
  /**
   * 查看福利
   */
  gotoWelfare: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/packageA/pages/welfare/welfare',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login?treeUserId=' + this.data.treeUserId,
      })
    }
  },
  /**
   * 查看排行榜
   */
  toggleRankDialog: function () {
    this.setData({
      rankReward: false
    })
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/packageA/pages/rankList/rankList',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login?treeUserId=' + this.data.treeUserId,
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
          utils.getUserInfoFun(this.checkMyPromise, this, this.data.treeUserId)
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

  // 查看攻略
  gotoStrategy: function () {
    // if (!this.data.isNew) {
      wx.navigateTo({
        url: '/packageA/pages/strategy/strategy',
      })
    // }
  }, 
  // 返回许愿池
  gobackMyTree: function () {
    if (this.data.isLogin) {
      if (this.data.visiterHasTree) {
        wx.navigateTo({
          url: '/packageA/pages/wishTree/wishTree',
        })
      } else {
        wx.navigateTo({
          url: '/packageA/pages/wishing/wishing',
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login?treeUserId=' + this.data.treeUserId,
      })
    }
  },
  
  /**
   * 浇水
   */
  submitWatering: function () {
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
                // 更新访客信息
                if (this.data.visiterHasTree) {
                  this.getVisiterTree()
                }
              }, 3600)
              // 5s后继续隐藏浇水动画信息 等待下一次浇水动画生成
              setTimeout(() => {
                this.setData({
                  isWatering: false
                })
              }, 5500)
            } else if (res.data.status == 801) {
              utils.getUserInfoFun(this.submitWatering, this, this.data.treeUserId)
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
        url: '/pages/login/login?treeUserId=' + this.data.treeUserId,
      })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.toLowerCase().indexOf('iphone x') > -1) {
          this.setData({
            iphonex: true
          })
        }
      }
    })
    this.setData({
      treeUserId: options.treeUserId
    })
  },
  /**
   * 获取许愿树信息
   */
  getWishTree: function () {
    wx.request({
      url: config.config.getWateringTreeInfo,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: this.data.token,
        treeUserId: this.data.treeUserId
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          this.setData({
            promiseTree: res.data.bean.promiseTree || {},
            radicesValue: res.data.bean.radicesValue,        
            gatherValue: res.data.bean.gatherValue || 0,    
            treeId: res.data.bean.promiseTree.id,
            userId: res.data.bean.promiseTree.userId,
            growthValue: res.data.bean.promiseTree.growthValue,
            matureValue: res.data.bean.promiseTree.matureValue,
            growthStage: res.data.bean.promiseTree.growthStage,
            isLoading: true,
            treeUserId: res.data.bean.promiseTree.userId,
            giftPictureCover: res.data.bean.giftPictureCover,
            defaultPage: 1
          })
          wx.setNavigationBarTitle({
            title: res.data.bean.promiseName
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
        } else if (res.data.status == 201) {          
          // 果实已收货 禁止浇水
          wx.stopPullDownRefresh()       
          this.setData({
            isLoading: true,
            canWatering: false
          })
          wx.setNavigationBarTitle({
            title: '许愿树'
          })
          if (!this.data.iphonex) {
            this.setData({
              bgMode: "notree-bg"
            })
          } else {
            this.setData({
              bgMode: "notree-bg-x"
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getWishTree, this, this.data.treeUserId)
        } else {
          utils.showTips(res.data.msg)
          this.setData({
            isLoading: true
          })
        }
      }
    })
  },
  /**
   * 获取访客的许愿池信息
   */
  getVisiterTree: function () {
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
          wx.stopPullDownRefresh()
          this.setData({
            waterMyself: res.data.bean.waterMyself || '2/2',
            waterFriends: res.data.bean.waterFriends || '4/4',
            visiterUserId: res.data.bean.promiseTree.userId
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getVisiterTree, this, this.data.treeUserId)
        } else {
          utils.showTips(res.data.msg)
          this.setData({
            isLoading: true
          })
        }
      }
    })
  },
  /**
   * 判断访客是否有树
   */
  judgeVisiterHasTree: function () {
    wx.request({
      url: config.config.getHasTreeVisiter,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: this.data.token
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean == 1) {
            this.setData({
              visiterHasTree: true
            })
            this.getVisiterTree()
          } else {
            this.setData({
              waterMyself: '2/2',
              waterFriends: '4/4'
            })
            wx.hideShareMenu()
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.judgeVisiterHasTree, this, this.data.treeUserId)
        } else {
          utils.showTips(res.data.msg)
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
          utils.getUserInfoFun(this.getTreeFriends, this, this.data.treeUserId)
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
          utils.getUserInfoFun(this.scrollTreeFriends, this, this.data.treeUserId)
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
            // wx.navigateTo({
            //   url: '',
            // })
            wx.reLaunch({
              url: '/packageA/pages/watering/watering?treeUserId=' + treeUserId,
            })
          } else {
            this.setData({
              showFriendList: false,
              noTree: true
            })
          }
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.judgeIsHasTree, this, this.data.treeUserId)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  // 好友列表弹框切换
  toggleFriendsDialog: function () {
    if (this.data.isLogin) {
      this.setData({
        showFriendList: !this.data.showFriendList,
        defaultPage: 1
      })
      if (this.data.showFriendList) {
        // if (this.data.visiterHasTree) {
          this.getTreeFriends()
        // }
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login?treeUserId=' + this.data.treeUserId,
      })
    }    
  },
  gotoWishing: function () {
    wx.navigateTo({
      url: '/packageA/pages/wishing/wishing',
    })
    this.toggleFriendsDialog()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // var token = "paixi_123"
    var token = wx.getStorageSync("token") || "paixi_123"
    var isLogin = wx.getStorageSync("isLogin") || false
    this.setData({
      token: token,
      isLogin: isLogin
    })
    // 获取许愿树信息
    this.getWishTree()
    // 已经登录
    if (this.data.isLogin && this.data.token != 'paixi_123') {
      // 判断访客是否有树 有树加载访客浇水信息
      this.judgeVisiterHasTree()
    } else {
      wx.hideShareMenu()
      this.setData({
        waterMyself: '2/2',
        waterFriends: '4/4'
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getWishTree()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from == "button") {
      if (res.target.id == 'shareWatering') {
        return {
          title: '@你,快来我的许愿树浇水帮我实现愿望吧～',
          path: '/packageA/pages/watering/watering?treeUserId=' + this.data.treeUserId,
          imageUrl: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20181127101842699764221.png'
        }
      }
    }
    // if (this.data.visiterHasTree) {
    //   return {
    //     title: '@你，快来帮我的许愿树浇水吧！等它成长结果后，我的愿望就实现咯~',
    //     path: '/packageA/pages/watering/watering?treeUserId=' + this.data.visiterUserId,
    //     imageUrl: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20181127101842699764221.png'
    //   }
    // } else {
      return {
        title: '@你,快来我的许愿树浇水帮我实现愿望吧～',
        path: '/packageA/pages/watering/watering?treeUserId=' + this.data.treeUserId,
        imageUrl: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20181127101842699764221.png'
      }
    // }  
  }
})
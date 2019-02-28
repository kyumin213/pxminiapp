// pages/shppingCar/shoppingCar.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({
  data: {
    tmpStartx: 0,
    goodsList: [],
    ordersPay: '',
    selectNum: 0,
    editIndex: 0,
    delBtnWidth: 150,
    isCheckedAll: false,
    total: 0,
    userInfo: {},
    hasUserInfo: false,
    canGoToDetail: true,
    isLoading: false
  },
  touchStart: function (e) {
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        tmpStartx: e.touches[0].clientX,
        tmpStarty: e.touches[0].clientY
      })
      var txtStyle = "left:0"
      var index = e.currentTarget.dataset.index;
      var list = this.data.goodsList
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        goodsList: list
      })
    }
  },
  touchMove: function (e) {
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX
      var moveY = e.touches[0].clientY
      var disY = this.data.tmpStarty - moveY
      // 垂直滑动在15像素内则为左滑删除
      if (Math.abs(disY) < 30) {
        // disX大于0 则为左滑
        var disX = this.data.tmpStartx - moveX
        var txtStyle = ''
        if (disX > 0) {
          txtStyle = "left:-" + disX + "rpx;border-radius:10rpx 0 0 10rpx;"
          if (disX > 75) {
            txtStyle = "left:-140rpx;border-radius:10rpx 0 0 10rpx;"
          } else {
            txtStyle = 'left:0rpx;border-radius:10rpx;'
          }
          if (disX >= 140) {
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "left:-140rpx;border-radius:10rpx 0 0 10rpx;"
            this.setData({
              canGoToDetail: false
            })
          }
        } else {
          txtStyle = 'left:0rpx;border-radius:10rpx;'
          this.setData({
            canGoToDetail: true
          })
        }
        var index = e.currentTarget.dataset.index;
        var list = this.data.goodsList;
        //将拼接好的样式设置到当前item中
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          goodsList: list
        })
      }
    }
  },
  touchEnd: function (e) {
    if (e.changedTouches.length == 1) {
      var moveX = e.changedTouches[0].clientX
      var moveY = e.changedTouches[0].clientY
      var disX = this.data.tmpStartx - moveX
      var disY = this.data.tmpStarty - moveY
      // 垂直滑动在15像素内则为左滑删除
      if (Math.abs(disY) < 30) {
        var txtStyle = ''
        if (disX > 75) {
          txtStyle = "left:-140rpx;border-radius:10rpx 0 0 10rpx;"
          this.setData({
            canGoToDetail: false
          })
        } else {
          txtStyle = 'left:0rpx;border-radius:10rpx;'
          this.setData({
            canGoToDetail: true
          })
        }
        var index = e.currentTarget.dataset.index;
        var list = this.data.goodsList;
        //将拼接好的样式设置到当前item中
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          goodsList: list
        })
      }
    }
  },
  /**
   * 跳转至商品详情
   */
  bindGoToDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.goodsList[index].productId
    var status = this.data.goodsList[index].status
    if (status != 0) {
      if (this.data.canGoToDetail) {
        wx.navigateTo({
          url: '/pages/productDetails/productDetails?id=' + id,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   * 获取登录状态isLogin
   * 获取token
   */
  onShow: function () {
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        if (res.data) {
          this.setData({
            isLogin: res.data
          })
        }
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
        if (res.data) {
          this.setData({
            token: res.data
          })
        }
        this.getCarList()
      },
      fail: (res) => {
        this.setData({
          token: app.globalData.token
        })
      }
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
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      goodsList: []
    })
  },
  /**
   * 停止下拉刷新
   */
  onPullDownRefresh: function () {
    if (this.data.isLogin != true) {
      utils.getUserInfoFun(this.getCarList, this)
    } else {
      wx.stopPullDownRefresh()
    }
  },
  /**
   * 删除商品
   */
  delGoods: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.goodsList[index].isDelete = true;
    var id = this.data.goodsList[index].id
    // 请求删除接口
    this.submitDelete(id, index)
  },
  submitDelete: function (id, index) {
    wx.request({
      url: config.config.postDeleteCar,
      method: 'POST',
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
          this.setData({
            total: res.data.total
          })
          this.setData({
            ordersPay: res.data.bean.ordersPay,
            ['goodsList[' + index + '].stylecss']: 'delete'
          })
          utils.showTips('删除成功')
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitDelete, this)
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
   * 获取购物车商品列表
   */
  getCarList: function () {
    wx.request({
      url: config.config.getCar,
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
          var goodsList = res.data.bean.itemList
          // goodsList.sort(utils.compareDown("updated"))
          var ordersPay = res.data.bean.ordersPay
          var total = res.data.total
          this.setData({
            goodsList: goodsList,
            ordersPay: ordersPay,
            total: total
          })
          if (total == 0) {
            this.setData({
              isLoading: true
            })
          }
          var param = {}
          var selectNum = 0
          var availablenum = []
          for (var i in this.data.goodsList) {
            if (goodsList[i].choose != 3 && goodsList[i].status != 0) {
              param.propName = JSON.parse(goodsList[i].productParamText).propName
              param.price = JSON.parse(goodsList[i].productParamText).price
              // this.data.goodsList[i].productParamText = param
              // 设置解析后的属性的值
              this.setData({
                ['goodsList[' + i + '].productParamText']: param,
                isLoading: true
              })
              // 根据choose 设置checkbox的checked值
              if (goodsList[i].choose == 1) {
                selectNum++
                this.setData({
                  ['goodsList[' + i + '].checked']: true,
                  selectNum: selectNum
                })
              } else if (goodsList[i].choose == 0) {
                this.setData({
                  ['goodsList[' + i + '].checked']: false
                })
              }
              availablenum.push(goodsList[i])
            } else {
              this.setData({
                isLoading: true
              })
            }
          }
          this.setData({
            availablenum: availablenum.length
          })
          // 比较数量 this.data.goodsList.length - 1
          if (this.data.selectNum == this.data.availablenum) {
            this.setData({
              isCheckedAll: true
            })
          } else {
            this.setData({
              isCheckedAll: false
            })
          }
          console.log(this.data.isLoading)
        } else if (res.data.status == 801) {
          // 重新授权
          utils.getUserInfoFun(this.getCarList, this)
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
   * 修改商品数量方法
   */
  modifyNumber: function (token, id, num) {
    wx.request({
      url: config.config.postNumber,
      data: {
        token: token,
        id: id,
        num: num
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          // console.log(res.data)
          var ordersPay = res.data.bean.ordersPay
          this.setData({
            ordersPay: ordersPay
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.modifyNumber, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 减商品数量
   */
  reduceNumber: function (e) {
    var index = e.currentTarget.dataset.index
    if (this.data.goodsList[index].num != 1) {
      this.data.goodsList[index].num--
    }
    this.setData({
      goodsList: this.data.goodsList
    })
    var id = this.data.goodsList[index].id
    var num = this.data.goodsList[index].num
    var token = this.data.token
    // 修改数量接口
    this.modifyNumber(token, id, num)
  },
  /**
   * 加商品数量
   */
  addNumber: function (e) {
    var index = e.currentTarget.dataset.index
    this.data.goodsList[index].num++
    this.setData({
      goodsList: this.data.goodsList
    })
    var id = this.data.goodsList[index].id
    var num = this.data.goodsList[index].num
    var token = this.data.token
    // 修改数量接口
    this.modifyNumber(token, id, num)
  },
  /**
   * 手动写入商品数量
   */
  bindKeyInput: function (e) {
    var index = e.detail.cursor
    console.log(index)
    this.data.goodsList[index].num = e.detail.value
    this.setData({
      ['goodsList[' + index + '].num']: this.data.goodsList[index].num,
    })
    console.log(this.data.goodsList)
  },
  bindKeyBlur: function (e) {
    console.log(e.detail)
  },
  /**
   * 修改勾选状态
   */
  checkboxChange: function (e) {
    var index = e.currentTarget.dataset.index
    if (this.data.goodsList[index].status != 0) {
      if (this.data.goodsList[index].choose == 1) {
        this.data.selectNum--
        this.setData({
          ['goodsList[' + index + '].checked']: false,
          ['goodsList[' + index + '].choose']: 0,
          selectNum: this.data.selectNum
        })
      } else if (this.data.goodsList[index].choose == 0) {
        this.data.selectNum++
        this.setData({
          ['goodsList[' + index + '].checked']: true,
          ['goodsList[' + index + '].choose']: 1,
          selectNum: this.data.selectNum
        })
      }
      // 比较数量
      if (this.data.selectNum == this.data.availablenum) {
        this.setData({
          isCheckedAll: true
        })
      } else {
        this.setData({
          isCheckedAll: false
        })
      }
      var id = this.data.goodsList[index].id
      var token = this.data.token
      var choose = this.data.goodsList[index].choose
      this.modifyRadioStatus(id, choose)
    }
  },
  modifyRadioStatus: function (id, choose) {
    wx.request({
      url: config.config.postChangeChoose,
      method: 'POST',
      dataType: 'json',
      data: {
        id: id,
        token: this.data.token,
        choose: choose
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data)
          var ordersPay = res.data.bean.ordersPay
          this.setData({
            ordersPay: ordersPay
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.modifyRadioStatus, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 修改全选状态
   */
  checkboxChangeAll: function (e) {
    // var token = app.globalData.token
    this.setData({
      isCheckedAll: !this.data.isCheckedAll
    })
    if (this.data.isCheckedAll) {
      var choose = 1
      for (var i in this.data.goodsList) {
        if (this.data.goodsList[i].choose != 3 && this.data.goodsList[i].status != 0) {
          this.setData({
            ['goodsList[' + i + '].checked']: true,
            ['goodsList[' + i + '].choose']: 1,
            selectNum: this.data.availablenum
          })
        }
      }
    } else {
      var choose = 0
      for (var i in this.data.goodsList) {
        if (this.data.goodsList[i].choose != 3 && this.data.goodsList[i].status != 0) {
          this.setData({
            ['goodsList[' + i + '].checked']: false,
            ['goodsList[' + i + '].choose']: 0,
            selectNum: 0
          })
        }
      }
    }
    this.submitSelectALL(choose)
  },
  submitSelectALL: function (choose) {
    wx.request({
      url: config.config.postSelectAll,
      method: 'POST',
      dataType: 'json',
      data: {
        token: this.data.token,
        choose: choose
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data)
          var ordersPay = res.data.bean.ordersPay
          this.setData({
            ordersPay: ordersPay
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitSelectALL, this)
        } else {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
   * 去结算
   */
  gotoPay: function () {
    console.log(this.data.selectNum)
    // 监听是否绑定手机号 是否有选中商品
    if (this.data.selectNum < 1) {
      utils.showTips('请选择要结算的商品')
    } else {
      this.getUserPhone()
    }
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
          wx.navigateTo({
            url: '/pages/confirmOrder/confirmOrder?isCart=1&isOpen=1',
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getUserPhone, this)
        } else {
          app.globalData.userPhone = ''
          wx.navigateTo({
            url: '/pages/bindPhone/bindPhone',
          })
          this.setData({
            hasUserPhone: false
          })
        }
      }
    })
  },
  goShopping: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})
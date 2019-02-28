// pages/groupSender/groupSender.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [],
    showPop: false,
    canClickSendBtn: true,
    fuckText: ''
  },
  togglePop: function () {
    this.setData({
      showPop: !this.data.showPop
    })
    if (this.data.showPop) {
      setTimeout(() => {
        this.setData({
          focus: true
        })
      },50)
    }
  },
  open: function () {
    this.setData({
      isShowActionsheet: !this.data.isShowActionsheet
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
   * 获取送礼情况
   */
  getGroupInfo: function () {
    wx.request({
      url: config.config.getGroupPartakeInfo,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if(res.data.status==200) {
          wx.stopPullDownRefresh()
          var ordersItems = res.data.bean.ordersItems
          var itemListCopy = [].concat(ordersItems)
          var canvasItemList = itemListCopy.splice(0, 2)
          this.setData({
            ordersItems: ordersItems,
            priceSplit: res.data.bean.priceSplit,
            priceTotal: res.data.bean.priceTotal,
            userPartakeStatus: res.data.bean.userPartakeStatus,
            messages: res.data.bean.userPartake,
            userGiveList: res.data.bean.userGiveList,
            userGiveDisparityNum: res.data.bean.userGiveDisparityNum,
            canvasItemList: canvasItemList
          })
          var param = {}
          for (var i in ordersItems) {
            param.propName = JSON.parse(ordersItems[i].productParamText).propName
            this.setData({
              ['ordersItems[' + i + '].productParamText']: param
            })
          }
          // 缓存要绘制的礼品的图片
          wx.getImageInfo({
            src: canvasItemList[0].productPicture,
            success: (res) => {
              this.setData({
                pictureone: res.path
              })
            }
          })
          if (canvasItemList.length > 1) {
            wx.getImageInfo({
              src: canvasItemList[1].productPicture,
              success: (res) => {
                this.setData({
                  picturesecond: res.path
                })
              }
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
   * 参与群送礼
   */
  joinGroup: function () {
    if (this.data.isLogin) {
      if (this.data.canClickSendBtn) {
        wx.request({
          url: config.config.postJoinGroup,
          data: {
            token: this.data.token,
            ordersId: this.data.ordersId
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
                  this.getGroupInfo()
                }
              })
            } else if (res.data.status == 801) {
              utils.getUserInfoFun(this.joinGroup, this)
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              this.getGroupInfo()
            }
          }
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 支付回调 提交订单
   */
  submitGroupOrder: function () {
    wx.request({
      url: config.config.postJoinGroupCallback,
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.showToast({
            title: '参与成功！',
            icon: 'none'
          })
          this.getGroupInfo()
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitGroupOrder, this)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  getTrueLength: function (str) {//获取字符串的真实长度（字节长度）
    var len = str.length, truelen = 0;
    for (var x = 0; x < len; x++) {
      if (str.charCodeAt(x) > 128) {
        truelen += 2;
      } else {
        truelen += 1;
      }
    }
    return truelen;
  },
  cutString: function (str, leng) {//按字节长度截取字符串，返回substr截取位置
    var len = str.length, tlen = len, nlen = 0;
    for (var x = 0; x < len; x++) {
      if (str.charCodeAt(x) > 128) {
        if (nlen + 2 < leng) {
          nlen += 2;
        } else {
          tlen = x;
          break;
        }
      } else {
        if (nlen + 1 < leng) {
          nlen += 1;
        } else {
          tlen = x;
          break;
        }
      }
    }
    return tlen;
  },
  drawShareImg: function (bgImg, codeImg) {
    this.setData({
      isShowCanvas: true
    })
    const ctx = wx.createCanvasContext('shareCanvas')
    var x = this.data.w
    ctx.drawImage(bgImg, 0, 0, this.data.w, 1.824 * this.data.w)

    // 绘制产品图片
    if (this.data.canvasItemList.length > 1) {
      var title1 = this.data.canvasItemList[0].productTitle
      var props1 = this.data.canvasItemList[0].productParamText.propName
      var picture1 = this.data.pictureone
      var num1 = this.data.canvasItemList[0].num
      var title2 = this.data.canvasItemList[1].productTitle
      var props2 = this.data.canvasItemList[1].productParamText.propName
      // var picture2 = this.data.canvasItemList[1].productPicture
      var picture2 = this.data.picturesecond
      var num2 = this.data.canvasItemList[1].num

      ctx.setFontSize(14);
      ctx.setFillStyle('#333333');
      for (var i = 1; this.getTrueLength(title1) > 0 && i < 3; i++) {
        var tl = this.cutString(title1, 24);
        ctx.fillText(title1.substr(0, tl).replace(/^\s+|\s+$/, ""), 0.36 * x, 0.83 * x + (i * 20));
        title1 = title1.substr(tl);
      }

      ctx.drawImage(picture1, 0.17 * x, 0.86 * x, 0.16 * x, 0.16 * x)
      ctx.setFontSize(12)
      ctx.setFillStyle('#ff2851');
      ctx.fillText('共' + num1 + '份', 0.38 * x, 1.015 * x)


      ctx.setFontSize(14);
      ctx.setFillStyle('#333333');
      for (var i = 1; this.getTrueLength(title2) > 0 && i < 3; i++) {
        var tl = this.cutString(title2, 24);
        ctx.fillText(title2.substr(0, tl).replace(/^\s+|\s+$/, ""), 0.36 * x, 1.10 * x + (i * 20));
        title2 = title2.substr(tl);
      }

      ctx.drawImage(picture2, 0.17 * x, 1.11 * x, 0.176 * x, 0.176 * x)
      ctx.setFontSize(12)
      ctx.setFillStyle('#ff2851');
      ctx.fillText('共' + num2 + '份', 0.38 * x, 1.275 * x)
    } else {
      var title1 = this.data.canvasItemList[0].productTitle
      var props1 = this.data.canvasItemList[0].productParamText.propName
      var picture1 = this.data.pictureone
      var num1 = this.data.canvasItemList[0].num
      let goodsTitleArray3 = [];
      if (title1.length > 12) {
        goodsTitleArray3.push(title1.substr(0, 13) + '...');
      } else {
        goodsTitleArray3.push(title1)
      }
      var yOffset = 1.21 * x
      goodsTitleArray3.forEach(function (value) {
        ctx.setFontSize(14);
        ctx.setFillStyle('#333333');
        // ctx.setTextAlign('left');
        ctx.fillText(value, 0.35 * x, yOffset, 0.4 * x);
        yOffset += 0.05 * x;
      });
      // 属性
      // ctx.setFontSize(12);
      // ctx.setFillStyle('#999999');
      // for (var i = 1; this.getTrueLength(props1) > 0 && i < 3; i++) {
      //   var tl = this.cutString(props1, 24);
      //   ctx.fillText(props1.substr(0, tl).replace(/^\s+|\s+$/, ""), 0.36 * x, 0.93 * x + (i * 20));
      //   props1 = props1.substr(tl);
      // }

      ctx.drawImage(picture1, 0.35 * x, 0.78 * x, 0.34 * x, 0.34 * x)
      ctx.setFontSize(12)
      ctx.setFillStyle('#ff2851');
      ctx.fillText('共' + num1 + '份', 0.46 * x, 1.28 * x)
    }
    ctx.setFontSize(12)
    ctx.setFillStyle('#fff');
    if (this.data.h == 812) {
      ctx.drawImage(codeImg, 0.416 * x, 1.48 * x, 0.168 * x, 0.168 * x)
      ctx.fillText('长按识别小程序码领取礼物', 0.32 * x, 1.7 * x)
    } else {
      ctx.drawImage(codeImg, 0.416 * x, 1.48 * x, 0.168 * x, 0.168 * x)
      ctx.fillText('长按识别小程序码领取礼物', 0.32 * x, 1.7 * x)
    }
    ctx.draw()
    wx.showLoading({
      title: '正在生成图片',
    })
    setTimeout(() => {
      wx.canvasToTempFilePath({
        width: this.data.w,
        height: 1.824 * this.data.w,
        canvasId: 'shareCanvas',
        success: (res) => {
          console.log(res.tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              wx.hideLoading()
              this.setData({
                isShowCanvas: false
              })
              wx.showToast({
                title: '保存图片成功',
              })
            }
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '保存图片失败',
            icon: 'none'
          })
        }
      })
    }, 3000)
  },
  saveCardPic: function () {
    this.setData({
      isShowActionsheet: !this.data.isShowActionsheet
    })
    if (this.data.canvasItemList.length > 1) {
      this.drawShareImg(this.data.bgImgTwo, this.data.codeImg)
    } else {
      this.drawShareImg(this.data.bgImg, this.data.codeImg)
    }
    // wx.navigateTo({
    //   url: '/pages/groupReceiver/groupReceiver?ordersId=' + this.data.ordersId,
    // })
  },
  // 获取二维码图片
  getCodeImg: function () {
    wx.request({
      url: config.config.postwachatCode,
      method: 'POST',
      data: {
        token: this.data.token,
        pagename: 'groupReceiver',
        routes: 'pages/groupReceiver/groupReceiver?ordersId=' + this.data.ordersId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.getImageInfo({
            src: res.data.bean,
            success: (res) => {
              this.setData({
                codeImg: res.path
              })
            }
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.getCodeImg, this)
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
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          winWidth: res.screenWidth + 'px',
          winHeight: res.screenHeight + 'px',
          w: res.screenWidth,
          h: res.screenHeight
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  /***
   *  获取祝福文本框的值
   */
  bindTextAreaBlur: function (e) {
    this.setData({
      fuckText: e.detail.value
    })
    console.log(e.detail.value)
  },
  /**
   * 提交祝福
   */
  submitMessage: function (e) {
    var fuckContent = this.data.fuckText
    if (fuckContent == '') {
      wx.showToast({
        title: '请输入您的祝福',
        icon: 'none'
      })
    } else {
      wx.request({
        url: config.config.postSubmitMessage,
        data: {
          token: this.data.token,
          ordersId: this.data.ordersId,
          fuckContent: fuckContent
        },
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            wx.showToast({
              title: '祝福成功！',
              icon: 'none'
            })
            this.setData({
              showPop: !this.data.showPop
            })
            this.getGroupInfo()
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.submitMessage, this)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            this.setData({
              showPop: !this.data.showPop
            })
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
        if (res.data) {
          this.setData({
            token: res.data
          })
        }
        this.getGroupInfo()
        this.getCodeImg()
      },
      fail: (res) => {
        this.setData({
          token: 'paixi_123'
        })
        this.getGroupInfo()
      }
    })
    // todo 修改
    // wx.getImageInfo({
    //   src: 'https://image.prise.shop/images/2018/08/07/1533636443383689.png',
    //   success: (res) => {
    //     this.setData({
    //       codeImg: res.path
    //     })
    //   }
    // })
    wx.getImageInfo({
      src: 'https://image.prise.shop/images/2018/08/08/1533718277593366.png',
      success: (res) => {
        this.setData({
          bgImg: res.path
        })
      }
    })
    wx.getImageInfo({
      src: 'https://image.prise.shop/images/2018/08/08/1533718277593366.png',
      success: (res) => {
        this.setData({
          bgImgTwo: res.path
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
    this.getGroupInfo()
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
    if (res.from === 'button') {
      if (res.target.id == 'sendreceiver') {
        return {
          title: '请收下我们为你准备的礼物！',
          path: '/pages/groupReceiver/groupReceiver?ordersId=' + this.data.ordersId,
          imageUrl: 'https://image.prise.shop/images/2018/08/08/1533718176107717.png'
        }
        this.setData({
          isShowActionsheet: !this.data.isShowActionsheet
        })
      } else {
        return {
          title: '一起为好友拼单送好礼吧!',
          path: '/pages/groupSender/groupSender?ordersId=' + this.data.ordersId,
          imageUrl: 'https://image.prise.shop/images/2018/08/08/1533698582660465.png',
          success: function (res) {
            // 转发成功
          },
          fail: function (res) {
            // 转发失败
          }
        }
      }
    } else {
      return {
        title: '一起为好友拼单送好礼吧!',
        path: '/pages/groupSender/groupSender?ordersId=' + this.data.ordersId,
        imageUrl: 'https://image.prise.shop/images/2018/08/08/1533698582660465.png',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }     
  }
})
// pages/giftCard/giftCard.js
const app = getApp()
var config = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowActionsheet: false,
    isShowMore: false,
    scrollHeight: '730rpx',
    isShowCanvas: true
  },
  close: function () {
    this.setData({
      isShowActionsheet: !this.data.isShowActionsheet
    })
  },
  open: function (e) {
    var formId = e.detail.formId
    this.submitFormId(formId)
  },
  submitFormId: function (formId) {
    wx.request({
      url: config.config.postFormIdSender,
      method: 'POST',
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        notifyFormId: formId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            isShowActionsheet: !this.data.isShowActionsheet
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.submitFormId, this)
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
      // status: options.status
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
   * 获取订单详情
   */
  getCard: function () {
    wx.request({
      url: config.config.getGiftCardDetails,
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
          var itemList = res.data.bean.itemVoList
          if (itemList.length > 3) {
            this.setData({
              isShowMore: true
            })
          }
          var itemListCopy = [].concat(itemList)
          var canvasItemList = itemListCopy.splice(0, 2)
          var itemlistsub = itemList.splice(0, 3)
          this.setData({
            ordersItemNum: res.data.bean.ordersItemNum,
            itemList: itemlistsub,
            canvasItemList: canvasItemList,
            userMaker: res.data.bean.userMaker
          })
          var param = {}
          for (var i in itemlistsub) {
            param.propName = JSON.parse(itemlistsub[i].productParamText).propName
            this.setData({
              ['itemList[' + i + '].productParamText']: param
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
  showAllItem: function () {
    this.setData({
      scrollHeight: '800rpx',
      isShowMore: false
    })
    wx.request({
      url: config.config.getGiftCardDetails,
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
          var itemList = res.data.bean.itemVoList
          this.setData({
            ordersItemNum: res.data.bean.ordersItemNum,
            itemList: res.data.bean.itemVoList,
            userMaker: res.data.bean.userMaker
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取二维码图片
  getCodeImg: function () {
    wx.request({
      url: config.config.postwachatCode,
      method: 'POST',
      data: {
        token: this.data.token,
        pagename: 'pintuGame',
        routes: 'pages/pintuGame/pintuGame?ordersId=' + this.data.ordersId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res.data.bean)
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (res.data) {
          this.setData({
            token: res.data
          })
        }
        this.getCard()
        // Todo 稍后开启 获取二维码图片 先用静态图代替
        this.getCodeImg()
        // wx.getImageInfo({
        //   src: "https://image.prise.shop/images/2018/05/24/1527148179586956.png",
        //   success: (res) => {
        //     this.setData({
        //       codeImg: res.path
        //     })
        //   }
        // })
      },
    })
    wx.getImageInfo({
      src: 'https://image.prise.shop/images/2018/06/20/1529489284897141.png',
      success: (res) => {
        this.setData({
          bgImg: res.path
        })
      }
    })
    wx.getImageInfo({
      src: 'https://image.prise.shop/images/2018/06/20/1529489281100896.png',
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
      // var picture1 = this.data.canvasItemList[0].productPicture
      var picture1 = this.data.pictureone
      var num1 = this.data.canvasItemList[0].num
      var title2 = this.data.canvasItemList[1].productTitle
      // var picture2 = this.data.canvasItemList[1].productPicture
      var picture2 = this.data.picturesecond
      var num2 = this.data.canvasItemList[1].num


      //title1111111111111111111为了防止标题过长，分割字符串,每行18个
      ctx.setFontSize(14);
      ctx.setFillStyle('#333333');
      for (var i = 1; this.getTrueLength(title1) > 0 && i < 3; i++) {
        var tl = this.cutString(title1, 24);
        ctx.fillText(title1.substr(0, tl).replace(/^\s+|\s+$/, ""), 0.36 * x, 0.97 * x + (i * 20));
        title1 = title1.substr(tl);
      }

      ctx.drawImage(picture1, 0.17 * x, 0.99 * x, 0.16 * x, 0.16 * x)
      ctx.setFontSize(12)
      ctx.setFillStyle('#999');
      ctx.fillText('共' + num1 + '份', 0.36 * x, 1.14 * x)

      // title2222222222222222222222222222222
      ctx.setFontSize(14);
      ctx.setFillStyle('#333333');
      for (var i = 1; this.getTrueLength(title2) > 0 && i < 3; i++) {
        var tl = this.cutString(title2, 24);
        ctx.fillText(title2.substr(0, tl).replace(/^\s+|\s+$/, ""), 0.36 * x, 1.23 * x + (i * 20));
        title2 = title2.substr(tl);
      }

      ctx.drawImage(picture2, 0.17 * x, 1.24 * x, 0.176 * x, 0.176 * x)
      ctx.setFontSize(12)
      ctx.setFillStyle('#999');
      ctx.fillText('共' + num2 + '份', 0.36 * x, 1.39 * x)
    } else {
      var title1 = this.data.canvasItemList[0].productTitle
      var picture1 = this.data.pictureone
      var num1 = this.data.canvasItemList[0].num
      let goodsTitleArray3 = [];
      if (title1.length > 5) {
        goodsTitleArray3.push(title1.substr(0, 6) + '...');
      } else {
        goodsTitleArray3.push(title1)
      }
      var yOffset = 1.3 * x
      goodsTitleArray3.forEach(function (value) {
        ctx.setFontSize(14);
        ctx.setFillStyle('#333333');
        // ctx.setTextAlign('left');
        ctx.fillText(value, 0.4 * x, yOffset, 0.4 * x);
        yOffset += 0.05 * x;
      });
      // ctx.setFontSize(16)
      // ctx.setFillStyle('#000000');
      // ctx.fillText(title1, 0.4 * x, 0.68 * x)
      ctx.drawImage(picture1, 0.388 * x, 0.99 * x, 0.24 * x, 0.24 * x)
      ctx.setFontSize(12)
      ctx.setFillStyle('#999');
      ctx.fillText('共' + num1 + '份', 0.46 * x, 1.36 * x)
    }
    ctx.setFontSize(12)
    ctx.setFillStyle('#333');
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
            },
            fail: (res) => {
              wx.showToast({
                title: '保存图片失败',
                icon: 'none'
              })
              this.setData({
                isShowCanvas: false
              })
              // 拒绝授权 二次授权
              wx.getSetting({
                success(res) {
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                        console.log('success')
                      },
                      fail() {
                        utils.showModelStr('友情提示', '您点击了拒绝授权，将无法保存图片，点击确定重新获取授权', '确定', '取消', (res) => {
                          if (res.confirm) {
                            wx.openSetting({
                              success: (res) => {
                                console.log(res)
                                if (res.authSetting["scope.writePhotosAlbum"]) {
                                  // this.addAddress()
                                }
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                }
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
    //   url: '/pages/pintuGame/pintuGame?ordersId=' + this.data.ordersId,
    // })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
      this.setData({
        isShowActionsheet: !this.data.isShowActionsheet
      })
    }
    return {
      title: '拼图拼惊喜！',
      path: '/pages/pintuGame/pintuGame?ordersId=' + this.data.ordersId,
      imageUrl: 'https://image.prise.shop/images/2018/06/20/1529489590791131.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
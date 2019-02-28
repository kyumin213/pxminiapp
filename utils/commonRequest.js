var config = require('./config.js');
/**
 * 公共请求 点击收藏 点赞，不带Loadding
 */
function request(url, params, success, fail) {
  var clientData = getApp().globalData.client;
  var token = getApp().globalData.token;
  if (!token) {
    try {
      token = wx.getStorageSync("token");
    } catch (e) {

    }
  }
  params.token = token;
  this.requestLoading(url, params, "", success, fail)
}

/**
 * 带loading请求
 */
function loadingRequest(url, params, message, success, fail) {
  var token = getApp().globalData.token;
  params.token = token;
  this.requestLoading(url, params, message, success, fail)
}


// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
/** 公共请求 */

function requestLoading(url, params, message, success, fail) {
  console.log(params)
  var that = this;
  if (message != "") {
    wx.showLoading({ title: '加载中....', });
  }
  setTimeout(function () { wx.hideLoading() }, 2500);
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    success: function (res) {
      if (res.data.status == 200) {
        success(res.data)
      }
      if (res.data.status == 504) {
        wx.getUserInfo({
          success: function (res) {
            that.loginPx(res);
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    },
    fail: function (res) {
      wx.hideLoading()
      if (message != "") {
        wx.hideLoading()
      }
      fail()
    }
  })
}

function loginPx(res) {
  var loginRes = res;
  console.log(loginRes);
  getApp().globalData.userInfo = res.userInfo
  wx.login({
    success: function (res) {
      if (res.code) {
        wx.request({
          url: config.config.postCreateUser,
          data: {
            code: res.code,
            encryptedData: loginRes.encryptedData,
            iv: loginRes.iv,
          },
          dataType: 'json',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (resp) => {
            if (resp.data.status == 200) {
              console.log(resp.data.bean);
              getApp().globalData.token = resp.data.bean
              getApp().globalData.isLogin = true
              wx.setStorage({
                key: "token",
                data: resp.data.bean
              })
              wx.setStorage({
                key: "isLogin",
                data: true
              })
              this.setData({
                token: resp.data.bean
              })
              console.log("已经重新登陆，token已经存储了")
            }
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}

module.exports = {
  request: request,
  requestLoading: requestLoading,
  loginPx: loginPx,
  loadingRequest: loadingRequest,
}
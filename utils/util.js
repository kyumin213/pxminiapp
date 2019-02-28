const app = getApp()
var config = require('./config.js')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 普通toast提示
var showTips = text => wx.showToast({
  title: text,
  icon: 'none'
})


// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();
  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}

// 显示失败提示
var showModelStr = (title, content) => {
  wx.hideToast();
  wx.showModal({
    title,
    content: content,
    showCancel: false
  })
}

// 自定义弹窗
var showModelStr = (title, content, confirm, cancle, success) => {
  wx.hideToast();
  wx.showModal({
    title: title,
    confirmText: confirm,
    cancelText: cancle,
    content: content,
    success: function (res) {
      success(res);
    }
  })
}

/**
 * json 降序排序
 */
const compareDown = prop => {
  return function (obj1, obj2) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]
    if (val1 < val2) {
      return 1
    } else if (val1 > val2) {
      return -1
    } else {
      return 0
    }
  }
}

/**
 * json 升序排序
 */
const compareUp = prop => {
  return function (obj1, obj2) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}
/**
 * 重新授权获取token
 */
const getUserInfoFun = (callback, thispage, recommend) => {
  wx.login({
    success: (res) => {
      if (res.code) {
        wx.request({
          url: config.config.postRefreshToken,
          data: {
            code: res.code,
            recommend: recommend
          },
          dataType: 'json',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (data) => {
            if (data.data.status == 200) {
              app.globalData.token = data.data.bean
              // app.globalData.isLogin = true
              wx.setStorage({
                key: "token",
                data: data.data.bean
              })
              // wx.setStorage({
              //   key: "isLogin",
              //   data: true
              // })
              thispage.setData({
                token: data.data.bean
              })
              callback()
            } else if (data.data.status == 801) {
              getUserInfoFun(callback, thispage)
            }
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}

// get请求
const httpRequestGet = (url, params, success) => {
  wx.request({
    url: url,
    dataType: 'json',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params,
    success: success
  })
}
const httpRequestPost = (url, params, success) => {
  wx.request({
    url: url,
    dataType: 'json',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params,
    success: success
  })
}

module.exports = {
  formatTime: formatTime,
  showModelStr: showModelStr,
  compareDown: compareDown,
  compareUp: compareUp,
  getUserInfoFun: getUserInfoFun,
  showTips: showTips,
  httpRequestGet: httpRequestGet,
  httpRequestPost: httpRequestPost
}

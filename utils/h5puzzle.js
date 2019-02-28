class Puzzle {
  constructor(page, opts) {
    opts = opts || {};
    this.page = page;
    this.type = opts.type ||3;
    this.width = 0;
    this.height = 0;

    this.init();
  }
  init(){
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res.windowWidth)
        if (res.windowWidth < 400) {
          _this.page.setData({
            WIDTH: res.windowWidth * 0.88,
            HEIGHT: res.windowWidth * 0.88,
            width: res.windowWidth * 0.88 / _this.type,
            height: res.windowWidth * 0.88 / _this.type
          });
          _this.width = res.windowWidth * 0.88 / _this.type;
          _this.height = res.windowWidth * 0.88 / _this.type;
        } else {
          _this.page.setData({
            WIDTH: 365,
            HEIGHT: 365,
            width: 365 / _this.type,
            height: 365 / _this.type
          });
          _this.width = 365 / _this.type;
          _this.height = 365 / _this.type;
        }
      }
    });
    this.originX = 0;
    this.originY = 0;
    this.originPX = 0;
    this.originPY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.tx = 0;
    this.ty = 0;
    this.cval = null;
    this.val = null;
    this.typeArr = [];
    this.newTypeArr = [];
    this.pointsArr = [];
    this.initTypeArr();
    this.randomArr();
    this.gameOver = false
    this.scrollTop = 0

    this.page.setData({ imgPoints: this.newTypeArr});
    this.bindEvent();
  }
  initTypeArr(){
    let arr = [],count = 0;
    for(let i = 0; i < this.type; i++){
      arr[i] = [];
      for(let j = 0; j < this.type; j++){
        arr[i].push({
          x: j,
          y: i,
          px: j,
          py: i,
          count: count,
          active: false
        });
        this.pointsArr.push(count);
        count++;
      }
    }
    this.typeArr = arr;
  }
  randomArr(){
    let len = this.pointsArr.length - 1;
    for(let i = 0; i < len; i++){
      let index = parseInt(Math.random() * len);
      let current = this.pointsArr[i];
      this.pointsArr[i] = this.pointsArr[index];
      this.pointsArr[index] = current;
    }
    for (let j = 0, le = this.typeArr.length; j < le; j++){
      let arr = this.typeArr[j];
      this.newTypeArr[j] = [];
      for (let k = 0,l = arr.length; k < l; k++){
        let val = arr[k];
        this.newTypeArr[j].push({
          x: val.x,
          y: val.y,
          px: this.pointsArr[val.count] % this.type,
          py: parseInt(this.pointsArr[val.count] / this.type),
          count: val.count,
          active: false
        })
      }
    }
  }
  checkWin(){
    return JSON.stringify(this.typeArr) === JSON.stringify(this.newTypeArr);
  }
  bindEvent(){
    let _this = this;
    let page = this.page;
    let i = 0;
    page.onTap = function (e) {
      wx.createSelectorQuery().selectViewport().scrollOffset((res) => {
        _this.scrollTop = res.scrollTop
        // console.log(_this.scrollTop)
      }).exec()
      i++;
      if (i % 2 == 0) {
        // 偶数次点击
        let xx = parseInt((e.touches[0].clientX - 22) / _this.width), yy = parseInt((e.touches[0].clientY - 96) / _this.height);
        // let xx = parseInt((e.touches[0].clientX - 22) / _this.width), yy = parseInt((e.touches[0].pageY - 138 - _this.scrollTop) / _this.height);        
        let cval = _this.newTypeArr[yy][xx];
        _this.cval = _this.newTypeArr[yy][xx];
        var currentTX = cval.x
        var currentTY = cval.y
        var tx = (currentTX - _this.originTX) * _this.width
        var ty = (currentTY - _this.originTY) * _this.height
        _this.val.px = cval.px;
        _this.val.py = cval.py;

        _this.val.active = false;
        _this.cval.px = _this.originPX;
        _this.cval.py = _this.originPY;
   
        _this.cval.active = false;

        _this.page.setData({
          imgPoints: _this.newTypeArr,
          tx: tx,
          ty: ty
        })
        // console.log(_this.typeArr, _this.newTypeArr)
        if (_this.checkWin()) {
          // 闯关成功
          _this.page.setData({
            gameOver: true
          })
        }
      } else {
        // 奇数次点击
        let x = parseInt((e.touches[0].clientX - 22) / _this.width), y = parseInt((e.touches[0].clientY - 96) / _this.height);
        // let x = parseInt((e.touches[0].clientX  - 22) / _this.width), y = parseInt((e.touches[0].pageY - 138 - _this.scrollTop) / _this.height);
        let val = _this.newTypeArr[y][x];
        _this.val = _this.newTypeArr[y][x];
        _this.val.active = true
        _this.page.setData({
          imgPoints: _this.newTypeArr
        })
        _this.originPX = val.px;
        _this.originPY = val.py;
        _this.originTX = val.x
        _this.originTY = val.y
        // console.log(val)
      }
    }
  }
}
module.exports = Puzzle; 
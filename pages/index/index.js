let proListToTop = [], menuToTop = [], MENU = 0, windowHeight,timeoutId;
// MENU ==> 是否为点击左侧进行滚动的，如果是，则不需要再次设置左侧的激活状态
Page({
  data: {
    proList: [],
    currentActiveIndex: 0
  },
  onLoad: function (options) {
    const { proList } = require('../../proList.js')
    this.setData({
      proList: proList
    })
    // 确保页面数据已经刷新完毕~
    setTimeout(() => {
      this.getAllRects()
    }, 20)
  },
  changeMenu(e) {
    // 改变左侧tab栏操作
    if (Number(e.target.id) === this.data.currentActiveIndex) return
    MENU = 1
    this.setData({
      currentActiveIndex: Number(e.target.id),
      rightProTop: proListToTop[Number(e.target.id)]
    })
    this.setMenuAnimation(Number(e.target.id))
  },
  scroll(e) {
    for (let i = 0; i < proListToTop.length; i++) {
      if (e.detail.scrollTop < proListToTop[i] && i !== 0 && e.detail.scrollTop > proListToTop[i - 1]) {
        return this.setDis(i)
      }
    }
    // 找不到匹配项，默认显示第一个数据
    if (!MENU) {
      this.setData({
        currentActiveIndex: 0
      })
    }
    MENU = 0
  },
  setDis(i) {
    // 设置左侧menu栏的选中状态
    if (i !== this.data.currentActiveIndex + 1 && !MENU) {
      this.setData({
        currentActiveIndex: i - 1
      })
    }
    MENU = 0
    this.setMenuAnimation(i)
  },
  setMenuAnimation(i){
    // 设置动画，使menu滚动到指定位置。
    let self = this
    
    if (menuToTop[i].animate) {
      // 节流操作
      if(timeoutId){
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(()=>{
        self.setData({
          leftMenuTop: (menuToTop[i].top - windowHeight)
        })
      },50)
    } else {
      if (this.data.leftMenuTop === 0) return
      this.setData({
        leftMenuTop: 0
      })
    }
  },
  getActiveReacts(){
    wx.createSelectorQuery().selectAll('.menu-active').boundingClientRect(function (rects) {
      return rects[0].top
    }).exec()
  },
  getAllRects() {

    // 获取商品数组的位置信息
    wx.createSelectorQuery().selectAll('.pro-item').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        proListToTop.push(rect.top)
      })
    }).exec()

    // 获取menu数组的位置信息
    wx.createSelectorQuery().selectAll('.menu-item').boundingClientRect(function (rects) {
      wx.getSystemInfo({
        success: function (res) {
          windowHeight = res.windowHeight / 2
          rects.forEach(function (rect) {
            menuToTop.push({
              top: rect.top,
              animate:rect.top > windowHeight
              })
          })
        }
      })
    }).exec()
  },
  // 获取系统的高度信息
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight / 2
      }
    })
  }
})
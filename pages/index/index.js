let proListToTop = [], menuToTop = [], MENU = 0, windowHeight;
// MENU ==> 是否为点击左侧进行滚动的，如果是，则不需要再次设置左侧的激活状态
Page({
  data: {
    leftMenu: [],
    rightPro: [],
    currentActiveIndex: 0
  },
  onLoad: function (options) {
    const { proList } = require('../../proList.js')
    const menuArr = [], proArr = []
    proList.map((item, index) => {
      menuArr.push({
        name: item.opt_name,
        imgUrl: item.image_url
      })
      const itemArr = []
      item.children.map(item2 => {
        itemArr.push({
          name: item2.opt_name,
          imgUrl: item2.image_url
        })
      })
      proArr.push({
        menuName: item.opt_name,
        item: itemArr
      })
    })
    this.setData({
      leftMenu: menuArr,
      rightPro: proArr
    })
    // 确保页面数据已经刷新完毕~
    setTimeout(() => {
      this.getAllRects()
    }, 20)
  },
  changeMenu(e) {
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
    if (menuToTop[i]) {
      if (this.data.leftMenuTop === windowHeight) return
      this.setData({
        leftMenuTop: windowHeight
      })
    } else {
      if (this.data.leftMenuTop === 0) return
      this.setData({
        leftMenuTop: 0
      })
    }
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
            menuToTop.push(rect.top > windowHeight)
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
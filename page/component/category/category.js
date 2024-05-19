import config1 from './utils/detail';
Page({
  data: {
    category: [{
        name: '果味',
        id: 'guowei'
      },
      {
        name: '蔬菜',
        id: 'shucai'
      },
      {
        name: '炒货',
        id: 'chaohuo'
      },
      {
        name: '点心',
        id: 'dianxin'
      },
      {
        name: '粗茶',
        id: 'cucha'
      },
      {
        name: '淡饭',
        id: 'danfan'
      }, 
      {
        name:'书籍',
        id: 'shuji'
      },
      {
        name:'单片机',
        id:'danpianji'
      }
    ],
    detail: [],
    curIndex: 0,
    isScroll: false,
    toView: 'guowei'
  },
  onReady() {
    var self = this;

    self.setData({
        detail: config1
    })
    console.log(self.data)

  },
  switchTab(e) {
    const self = this;
    this.setData({
      isScroll: true
    })
    setTimeout(function () {
      self.setData({
        toView: e.target.dataset.id,
        curIndex: e.target.dataset.index
      })
    }, 0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    }, 1)

  }

})
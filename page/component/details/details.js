// page/component/details/details.js
const goodsData = require("../details/utils/goodsdata.js");
Page({
  data:{
    isImageVisible: false,
    goods: {},
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },
  showImage:function() {
    this.setData({
      isImageVisible: !this.data.isImageVisible
    });
  },
  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },

  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },

  onLoad:function(options){
    const self = this
    const id = parseInt(options.id, 10);
    const goods = goodsData.find(item =>item.id === id)
    console.log(options.id)
    if(goods) {
      self.setData({
        goods: goods
      });
    }
  },


  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
 
})
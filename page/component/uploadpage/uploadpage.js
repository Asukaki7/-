Page({
  data: {
    goods: {
      image: '',
      title: '',
      price: '',
      stock: '',
      detail: '',
      parameter: '',
      service: ''
    }
  },

  bindInputChange: function(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`goods.${field}`]: e.detail.value
    });
  },

  
  chooseImage: function() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          'goods.image': res.tempFilePaths[0]
        });
      }
    });
  },

  previewImage: function(e) {
    const current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    });
  },

  formSubmit: function() {
    const goods = this.data.goods;
    if (!goods.image || !goods.title || !goods.price || !goods.stock || !goods.detail || !goods.parameter || !goods.service) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    // 提交数据逻辑
    wx.showToast({
      title: '商品已上架',
      icon: 'success'
    });
    console.log('商品信息:', goods);
  }
});

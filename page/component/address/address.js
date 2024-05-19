// page/component/new-pages/user/address/address.js
Page({
  data: {
    address: {
      name: '',
      phone: '',
      detail: ''
    },
    latitude: '',
    longitude: ''

  },
  onLoad() {
    var self = this;

    wx.getStorage({
        key: 'address',
        success: function (res) {
          self.setData({
            address: res.data
          })
        }
      }),

      wx.getFuzzyLocation({
        type: 'wgs84',
        key: 'fuzzylocation',
        success(res) {
          self.setData({
            latitude : res.latitude,
            longitude: res.longitude
          })
          console.log(self.data);
        }
      })

  },

  formSubmit(e) {
    const value = e.detail.value;
    if (value.name && value.phone && value.detail) {
      wx.setStorage({
        key: 'address',
        data: value,
        success() {
          wx.navigateBack();
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
  }
})
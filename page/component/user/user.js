// page/component/new-pages/user/user.js
import config from './utils/orders.js';
Page({
  data: {
    thumb: '',
    nickname: '',
    orders: [],
    hasAddress: false,
    address: {}
  },
  onLoad() {
    var self = this;
    /**
     * 获取用户信息
     */
    // 已经授权，可以直接调用 获取头像昵称
    wx.getUserProfile({
        success: function (res) {
          self.setData({
            thumb: res.userInfo.avatarUrl,
            nickname: res.userInfo.nickName
          })
          console.log(res.userInfo)
        }
      }),
      /**
       * 发起请求获取订单列表信息
       */
      self.setData({
        orders: config
      })
    console.log("self.data", self.data);
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  onShow() {
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },

  /**
   * 发起支付请求
   */
  payOrders(e) {
    const status = e.currentTarget.dataset.status;
  
    if (status === '待付款') {
      // 调用微信支付接口
      wx.requestPayment({
        timeStamp: 'String1', 
        nonceStr: 'String2',
        package: 'String3',
        signType: 'MD5',
        paySign: 'String4',
        success: function (res) {
          console.log(res);
          // 支付成功后的操作
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          });
        },
        fail: function (res) {
          wx.showModal({
            title: '支付提示',
            content: '支付失败',
            showCancel: false
          });
        }
      });
    } else if (status === '已付款') {
      // 已付款，直接提示
      wx.showModal({
        title: '支付提示',
        content: '您已完成支付，无需重复操作',
        showCancel: false
      });
    } else {
      // 其他状态，提示错误
      wx.showModal({
        title: '支付提示',
        content: '订单状态异常，请联系客服',
        showCancel: false
      });
    }
  },

  refundOrders() {

  }



})
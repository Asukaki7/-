// page/component/details/details.js
const CryptoJS = require("crypto-js")
const JSEncrypt = require('../../../node_modules/jsencrypt/bin/jsencrypt.min.js'); 
const APP_KEY = '2088722000215333';
const TRACE_APP_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAonbGhedhT5vAan8JjgyL
uler1Y4XDgvRCzuGQhYWbI9o0ZHpQS+Up7J1ej+krDuSeYjnCjlp9YcI6HoqVk1+
ljn0T62kCdEAlaw5L8K5qsjFUWPZ2IvA1Kkghmcu+i6+mEesmeAkjQnvl6BRP+s3
L5KRXYyFk2WbkilM26AnfwE/aq+nN8BnqFtjyJRi7h+9sGsiN1Ciyzxl5ZZRjqs+
IjaV8dI/xwdhqvyHuZ7Fv/HabiMPRSoV0c80SjaBIHvJ5KWoPobOcKXNaDcDhGg3
o2bAi0g2J0p3JXsJsEmCqqHbl/F6ycmcpBZa8ARiqjstI+uvOEFMCwJfsAPm0UBc
LQIDAQAB
-----END PRIVATE KEY-----`;
const TAAS_URL = 'https://tschain.cloud.alipay.com';

// SDK最新版本
const LATEST_VERSION = 'V_1_6_5';
const goodsData = require("../details/utils/goodsdata.js");
Page({
  data:{
    goods: {},
    

    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
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
    this.sendRequest();
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
  },

  sendRequest: function() {
    const method = '/trace/merchant/list';

    // 请求参数
    const queryEntity = {
      isSelf: false,
      name: null,
      merchantId: null,
      authStatus: null
    };

    const pageEntity = {
      num: 1,
      size: 10,
      data: queryEntity
    };

    const commonEntity = {
      data: pageEntity,
      appId: APP_KEY,
      version: LATEST_VERSION,
      timestamp: Date.now()
    };

    // 请求信息序列化为json字符串
    const body = JSON.stringify(commonEntity);

    // 对请求body进行签名
    const signData = this.sign(body, TRACE_APP_PRIVATE_KEY);

    // 请求发送
    wx.request({
      url: TAAS_URL + method,
      method: 'POST',
      data: body,
      header: {
        'content-type': 'application/json',
        'api-version': 'signature1.0',
        'sign-data': signData
      },
      success: function(res) {
        console.log(res.data);
      },
      fail: function(error) {
        console.error(error);
      }
    });
  },
  /**
   * 签名
   *
   * @param {string} data - 明文
   * @param {string} privateKey - 私钥
   * @returns {string} - 签名后的数据
   */
  sign: function(data, privateKey) {
    const jsEncrypt = new jsEncrypt();
    jsEncrypt.setPrivateKey(privateKey);
    const signature = jsEncrypt.sign(data, CryptoJS.SHA256, "sha256");

    return signature;
  },
  
   /**
   * 加载私钥数据
   *
   * @param {string} key - 私钥文本
   * @returns {object} - 私钥对象
   */
  loadPrivateKey: function(key) {
    // 私钥处理逻辑
    return key.replace('-----BEGIN PRIVATE KEY-----', '')
              .replace('-----END PRIVATE KEY-----', '')
              .replace(/\n/g, '');
  }
})
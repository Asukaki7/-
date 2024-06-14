// page/component/details/details.js
const APP_KEY = '2088722000215333';
const TRACE_APP_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAonbGhedhT5vAan8JjgyLuler1Y4XDgvRCzuGQhYWbI9o0ZHpQS+Up7J1ej+krDuSeYjnCjlp9YcI6HoqVk1+ljn0T62kCdEAlaw5L8K5qsjFUWPZ2IvA1Kkghmcu+i6+mEesmeAkjQnvl6BRP+s3L5KRXYyFk2WbkilM26AnfwE/aq+nN8BnqFtjyJRi7h+9sGsiN1Ciyzxl5ZZRjqs+IjaV8dI/xwdhqvyHuZ7Fv/HabiMPRSoV0c80SjaBIHvJ5KWoPobOcKXNaDcDhGg3o2bAi0g2J0p3JXsJsEmCqqHblF6ycmcpBZa8ARiqjstI+uvOEFMCwJfsAPm0UBcLQIDAQAB-----END PRIVATE KEY-----`;
const TAAS_URL = 'https://tschain.cloud.alipay.com';

// SDK最新版本
const LATEST_VERSION = 'V_1_6_5';
const goodsData = require("../details/utils/goodsdata.js");
const CryptoJS = require('crypto-js')
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
    const goods = find(item =>item.id === id)
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
    const method = '1021533300240602e626dc1863c4445394ea2fc6b2f803d2';

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
  

  sign:function(plain, priKey) {
    try {
      const privateKey = loadPriKey(priKey);
      const signature = CryptoJS.algo.AES.create();
      signature.init(privateKey);
      signature.update(CryptoJS.enc.Utf8.parse(plain));
      return signature.sign(CryptoJS.SHA256, plain).toString(CryptoJS.enc.Base64);
    } catch (error) {
      throw new Error('签名失败:', error);
    }
  },
  
  
   /**
   * 加载私钥数据
   *
   * @param {string} key - 私钥文本
   * @returns {object} - 私钥对象
   */
  loadPriKey:function(priKey) {
    try {
      // 读取私钥文本，去除头部和尾部
      const privateKeyBase64 = priKey.replace(/^-----BEGIN RSA PRIVATE KEY-----\n|\n-----END RSA PRIVATE KEY-----$/g, '');
      // 对读取回来的数据进行Base64解码
      const privateKeyBytes = CryptoJS.enc.Base64.parse(privateKeyBase64);
      // 重新封装成一个PrivateKey对象
      const keySpec = CryptoJS.lib.RSA.keyFromPrivate(privateKeyBytes, 'pkcs8');
      return keySpec;
    } catch (error) {
      throw new Error('加载私钥失败:', error);
    }  
  }
})
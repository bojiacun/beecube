/*
 * Copyright (C) 2023  即时通讯网(52im.net) & Jack Jiang.
 * The MobileIMSDK-微信小程序客户端 Project. All rights reserved.
 *
 * 【本产品为著作权产品，请在授权范围内放心使用，禁止外传！】
 *
 * 【本系列产品在国家版权局的著作权登记信息如下】：
 * 1）国家版权局登记名（简称）和证书号：RainbowChat（软著登字第1220494号）
 * 2）国家版权局登记名（简称）和证书号：RainbowChat-Web（软著登字第3743440号）
 * 3）国家版权局登记名（简称）和证书号：RainbowAV（软著登字第2262004号）
 * 4）国家版权局登记名（简称）和证书号：MobileIMSDK-Web（软著登字第2262073号）
 * 5）国家版权局登记名（简称）和证书号：MobileIMSDK（软著登字第1220581号）
 * 著作权所有人：江顺/苏州网际时代信息科技有限公司
 *
 * 【违法或违规使用投诉和举报方式】：
 * 联系邮件：jack.jiang@52im.net
 * 联系微信：hellojackjiang
 * 联系QQ： 413980957
 * 官方社区：http://www.52im.net
 */
/**
 * 一些MobileIMSDK-微信小程序端要用到的实用工具函数等。
 *
 * @author Jack Jiang(http://www.52im.net/thread-2792-1-1.html)
 */
class ModuleMBUtils {

  // 构造器（相当于java里的构造方法）
  constructor(argument) {
    this.TAG = "MBUtils";
  }

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String。
   *
   *  月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   *  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)。
   *
   *  【示例】：
   *  common.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
   *  common.formatDate(new Date(), 'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
   *  common.formatDate(new Date(), 'hh:mm:ss.S')            ==> 08:09:04.423
   */
  formatDate(date, fmt) { //author: meizz
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  /**
   * 将字符串解析成日期。
   *
   * 【示例】：
   * parseDate('2016-08-11'); // Thu Aug 11 2016 00:00:00 GMT+0800
   * parseDate('2016-08-11 13:28:43', 'yyyy-MM-dd HH:mm:ss') // Thu Aug 11 2016 13:28:43 GMT+0800
   *
   * @param str 输入的日期字符串，如'2014-09-13'
   * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
   * @returns 解析后的Date类型日期
   */
  parseDate(str, fmt) {
    fmt = fmt || 'yyyy-MM-dd';
    var obj = {
      y: 0,
      M: 1,
      d: 0,
      H: 0,
      h: 0,
      m: 0,
      s: 0,
      S: 0
    };
    fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
      str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
        obj[$3] = parseInt(_$1);
        return '';
      });
      return '';
    });
    obj.M--; // 月份是从0开始的，所以要减去1
    var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
    if (obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
    return date;
  }

  mblog(message) {
    var logPrefix = '⚪️ [' + this.formatDate(new Date(), 'MM/dd hh:mm:ss.S') + '] ' + '[CORE] '; //☀
    var len = arguments.length;
    if (len === 1) {
      var logMsg = logPrefix + message;
      console.info(logMsg);
    } else if (len >= 2) {
      var logMsg = logPrefix + message;
      console.info(logMsg, arguments[1]);
    }
  }

  mblog_i() {
    var len = arguments.length;
    if (len === 1)
      this.mblog('<INFO>' + ' ' + arguments[0]);
    else if (len === 2)
      this.mblog('<INFO>' + (arguments[0] ? '[' + arguments[0] + ']' : '') + ' ' + arguments[1]);
    else if (len === 3)
      this.mblog('<INFO>' + (arguments[0] ? '[' + arguments[0] + ']' : '') + ' ' + arguments[1], arguments[2]);
  }

  mblog_d() {
    var len = arguments.length;
    if (len === 1)
      this.mblog('<DEBUG>' + ' ' + arguments[0]);
    else if (len === 2)
      this.mblog('<DEBUG>' + (arguments[0] ? '[' + arguments[0] + ']' : '') + ' ' + arguments[1]);
    else if (len === 3)
      this.mblog('<DEBUG>' + (arguments[0] ? '[' + arguments[0] + ']' : '') + ' ' + arguments[1], arguments[2]);
  }

  mblog_w() {
    var len = arguments.length;
    if (len === 1)
      this.mblog('<WARN>' + ' ' + arguments[0]);
    else if (len === 2)
      this.mblog('<WARN>' + (arguments[0] ? '[' + arguments[0] + ']' : '') + ' ' + arguments[1]);
    else if (len === 3)
      this.mblog('<WARN>' + (arguments[0] ? '[' + arguments[0] + ']' : '') + ' ' + arguments[1], arguments[2]);
  }

  mblog_e() {
    var len = arguments.length;
    if (len === 1)
      this.mblog('<ERROR>' + ' ' + arguments[0]);
    else if (len === 2)
      this.mblog('<ERROR>' + (arguments[0] ? '[' + arguments[0] + ']' : '') + ' ' + arguments[1]);
    else if (len === 3)
      this.mblog('<ERROR>' + (arguments[0] ? '[' + arguments[0] + ']' : '') + ' ' + arguments[1], arguments[2]);
  }

  /**
   * 是否正整数（即大于0的整数）。
   *
   * @param int
   * @returns {boolean}
   */
  isPositiveInteger(int) {
    if (!(/(^[1-9]\d*$)/.test(int))) {
      return false;
    }
    return true;
  }

  /**
   * 在JS中返回当前系统的时间戳。
   *
   * @returns {number} 形如：1280977330748 的长整数
   */
  getCurrentUTCTimestamp() {
    return new Date().getTime();
  }

  /**
   * 利用指定的WebSocket对象发送网络数据。
   * 
   * *********************************************************************************************
	 * <p>
	 * <b>特别说明：</b>想要确切知道本方法的数据发送成功与否怎么办？
	 * <ul>
	 * <li> 1）通过 fnSuccess、fnFail 参数指明的回调函数接收数据发送结果，可以准确得知数据是否发送成功（准确地
	 * 			是说是数据是否被成功写入tcp缓冲区）；</li>
	 * <li> 2）通过本方法的返回值，可以准确得知数据是否发送失败，但理论上无法百分百得知数据是否发送成功（准确地是
	 * 			说是数据是否被成功写入tcp缓冲区），因为微信小程序WebSocket的异步特性，是否成功需通过 fnSuccess、fnFail
	 * 			参数指明的回调函数接来得到结果。</li>
	 * </ul>
	 * <b>我的建议：</b>
	 * <ul>
	 * <li> 1）当你的场景下，需要准确得知发送结果时，请使用 fnSuccess、fnFail 参数来异步获取发送结果；</li>
	 * <li> 2）当你的场景下，不一定需要准确得到发送结果时，可以直接用返回值（代码写起来比用回调函数的方式要简单
	 * 			嘛），主流的im比如qq、微信、以及基于MobileIMSDK的im产品RainbowChat，由于存在消息送达保证机制，
	 * 			所以应用层只管发送，至于能不能准确获得发送结果，没有关系，因为在没有收到对方的ACK应答时，界面上的
	 * 			消息发送进度指示（菊花）会一直在转，余下的逻辑由QoS机制去判定消息被收到或没收到，不会受本方法的发
	 * 			送结果影响。</li>
	 * </ul>
   * *********************************************************************************************
   *
   * @param websocket {WebSocket} Websocket对象引用
   * @param dataWithString {String} 数据文本
   * @param fnSuccess {function} 接口调用成功的回调函数，非必填项
   * @param fnFail {function} 接口调用失败的回调函数，非必填项
   * @param fnComplete {function} 接口调用结束的回调函数（调用成功、失败都会执行），非必填项
   * @return {boolean} false表示数据发送时出错了（发送失败），理论上说true只代表没有发送失败但不代表一
   *                   定发送成功，因为微信小程序的Websocket发送是异步的）
   */
  send(websocket, dataWithString, fnSuccess, fnFail, fnComplete) {
    let that = this;
    let sendSucess = false;

    if (websocket && dataWithString) {
      if (wx.MBCore.debugEnabled())
        this.mblog_d(that.TAG, "正在send() websocket数据时，[dataWithString.len=" + dataWithString.length + "] ...");

      // 关于WebSocket的readyState字段值含义，请见：
      // https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/readyState
      if (websocket.readyState === 1) {
        try {
          // api文档：https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.send.html
          websocket.send({
            // 要发送的数据
            data: dataWithString,
            // 发送成功后的回调
            success(res) {
              // sendSucess = true;
              if (wx.MBCore.debugEnabled()) {
                that.mblog_i(that.TAG, ">> 数据已成功发出[dataLen=" + dataWithString.length + "].");
              }

              if (fnSuccess)
                fnSuccess(res);
            },
            // 发送失败后的回调
            fail(err) {
              that.mblog_w(that.TAG, ">> 数据发送失败[dataLen=" + dataWithString.length + "]，原因是：", err);

              if (fnSuccess)
                fnFail(err);
            },
            complete(res) {
              if (fnComplete)
                fnComplete(res);
            }
          });

          // 由于微信小程序WebSocket的异步执行特点，本参数为true只表示没有发送失败（详见本函数的详细说明部分）
          sendSucess = true;
        } catch (e) {
          this.mblog_w(that.TAG, "send方法中》》发送TCP数据报文时捕获到异常了，原因是：", e);
        }
      } else {
        this.mblog_e(that.TAG, "send方法中》》无法发送websocket数据，原因是：skt.readyState=" + websocket.readyState);
      }
    } else {
      this.mblog_w(that.TAG, "send方法中》》无效的参数：skt==null || d == null!");
    }

    return sendSucess;
  }

  /**
   * 生成uuid字符串。
   * 
   * @param {Number} len 非必填项，指定此值表示生成指定长度的随机字符串
   * @param {*} radix 
   */
  uuid(len, radix) {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS,
      uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data. At i==19 set the high bits of clock sequence
      // as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  }

  /**
   * 一个通用的信息提示模态对话框。
   * 
   * @param {string} alertMsg 信息提示内容
   */
  alert(alertMsg) {
    wx.showModal({
      title: '友情提示',
      content: alertMsg,
      showCancel : false,
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  }
}

// 以全局单例的形式存在，方便使用
wx.MBUtils = new ModuleMBUtils(); //MBUtils;
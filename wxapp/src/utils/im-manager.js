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
require("../lib/mobileimsdk/mobileimsdk-client-sdk.js")
let EventType = require("./event-type.js");
let EventBus = require("./event-bus.js");

/**
 * MobileIMSDK微信小程序端的管理类。
 * 建议在app.js中管理本类，确保SDK的生命周期同步于整个APP的生命周期。
 *
 * @author JackJiang(http://www.52im.net/thread-2792-1-1.html)
 */
class IMManager {
  constructor(app) {
    // 全局app对象引用
    this._app = app;
    // 初始化sdk
    this.initMobileIMSDK();
  }

  /**
   * 初始化SDK。
   *
   * 提示：不能像MobileIMSDK-H5端那样在各个回调实现函数（即“on...”这样的函数）中调用本类范围内的
   *      全局变量，因为它们作为回调被设置到IMSDK层之后，读取到的“this”对象是IMSDK本身，而非本类。
   */
  initMobileIMSDK() {
    let that = this

    /* ==================== MobileIMSDK的基本设置 ==================== */

    // 开启或关闭SDK的核心算法层Log输出，建议仅在调试时设为true
    wx.IMSDK.setDebugCoreEnable(true)
    // 开启或关闭SDK的框架内部Log输出，建议仅在调试时设为true
    wx.IMSDK.setDebugSDKEnable(true)
    // 开启或关闭SDK的框架内部心跳包的Log输出，建议仅在调试时设为true
    wx.IMSDK.setDebugPingPongEnable(true)
    // SDK核心IM框架的敏感度模式设置（默认MBSenseMode.MODE_15S，建议MBSenseMode.MODE_5S）
    wx.MBKeepAliveDaemon.setSenseMode(wx.MBSenseMode.MODE_5S)
    // 设置生成的消息id长度（建议设置32，不设置则默认24）
    wx.MBProtocalFactory.setMsgIdLength(12)

    /* ==================== MobileIMSDK的回调设置 ==================== */

    // 设置SDK的回调方法➊：用于debug的log输出
    wx.IMSDK.callback_onIMLog = this.log

    // 设置SDK的回调方法➋：用于收到聊天消息时在UI上展现出来（事件通知于收到IM消息时）
    wx.IMSDK.callback_onIMData = (p, options) =>{
      that.log('[DEMO] ----onIMData: ' + JSON.stringify(p), true);
      // 通知应用层页面刷新相关ui逻辑
      EventBus.post(EventType.onIMData, p, options);
    }

    // 设置SDK的回调方法➌：服务端对客户端提交的登陆请求处理完成后的回调（事件通知于成功登陆/认证后）
    wx.IMSDK.callback_onIMAfterLoginSucess = () =>{
      that.log('[DEMO] ----onIMAfterLoginSucess', true);
      // 通知应用层页面刷新相关ui逻辑
      EventBus.post(EventType.onIMAfterLoginSucess);
    }

    // 设置SDK的回调方法➍：客户端的登陆请求被服务端认证失败后的回调（事件通知于 登陆/认证 失败后）
    wx.IMSDK.callback_onIMAfterLoginFailed = (isReconnect) =>{
      that.log('[DEMO] 对不起，你' + (isReconnect ? '自动重连' : '登陆') + 'IM服务器失败了唉😡 ...', true);
      // 通知应用层页面刷新相关ui逻辑
      EventBus.post(EventType.onIMAfterLoginFailed);
    }

    // 设置SDK的回调方法➎：网络连接已断开时的回调（事件通知于与服务器的网络断开后）
    wx.IMSDK.callback_onIMDisconnected = () =>{
      that.log('[DEMO] Sorry，你掉线了唉😡 ...', true);
      // 通知应用层页面刷新相关ui逻辑
      EventBus.post(EventType.onIMDisconnected);
    }

    // 设置SDK的回调方法➏：掉线重连成功后的回调（事件通知于掉线重连成功后）
    wx.IMSDK.callback_onIMReconnectSucess = () =>{
      that.log('[DEMO] 掉线自动重连成功了喔😁！', true);
      // 通知应用层页面刷新相关ui逻辑
      EventBus.post(EventType.onIMReconnectSucess);
    }

    // 设置SDK的回调方法➐：本地发出心跳包后的回调通知（本回调并非SDK核心逻辑，开发者可以不需要实现！）
    wx.IMSDK.callback_onIMPing = () =>{
      // TODO: 发布版中关闭以下用于demo的Log哦
      // that.log('[DEMO] 本地心跳包已发出了喔😁。', true);
      // 通知应用层页面刷新相关ui逻辑
      EventBus.post(EventType.onIMPing);
    }

    // 设置SDK的回调方法➑：收到服务端的心跳包反馈的回调通知（本回调并非SDK核心逻辑，开发者可以不需要实现！）
    wx.IMSDK.callback_onIMPong = () =>{
      // TODO: 发布版中关闭以下用于demo的Log哦
      // that.log('[DEMO] 收到服务端的心跳包反馈了喔😁！', true);
      // 通知应用层页面刷新相关ui逻辑
      EventBus.post(EventType.onIMPong);
    }

    // 设置SDK的回调方法➒：消息未送达的回调事件通知
    wx.IMSDK.callback_onMessagesLost = (lostMessages) =>{
      that.log("[DEMO] 收到了系统的未实时送达事件通知，当前共有" + lostMessages.length + "个包QoS保证机制结束，判定为【无法实时送达】唉😡！", true);
      // 通知应用层页面刷新相关ui逻辑
      EventBus.post(EventType.onMessagesLost, lostMessages);
    }

    // 设置SDK的回调方法➓：消息已被对方收到的回调事件通知
    wx.IMSDK.callback_onMessagesBeReceived = (theFingerPrint) =>{
      if (theFingerPrint != null) {
        that.log("[DEMO] 收到了对方已收到消息事件的通知喔😁，fp=" + theFingerPrint, true);
        // 通知应用层页面刷新相关ui逻辑
        EventBus.post(EventType.onMessagesBeReceived, theFingerPrint);
      }
    }
  }

  /**
    * 用于显示log信息，方便调试。
    *
    * 【补充说明】：当前演示代码中，本函数将被MobileIMSDK微信小程序端框架回调，请见IMSDK.callback_log回调函数的设置。
    * 【建议用途】: 开发者可在此回调中按照自已的意图打印MobileIMSDK微信小程序端框架中的log，方便调试时使用。
    *
    * @param {string } message 要显示的Log内容
    * @param {boolean} toConsole true表示显示到浏览器的控制台，否则直接显示到网页前端
    */
  log(message, toConsole) {
    var logMsg = toConsole?('🔵 ['+wx.MBUtils.formatDate(new Date(), 'MM/dd hh:mm:ss.S') + '] ' + message)
        : ('⚫️ ' + message +' '+wx.MBUtils.formatDate(new Date(), 'hh:mm:ss.S'));//☢
      console.debug(logMsg);
  }
}

export default IMManager

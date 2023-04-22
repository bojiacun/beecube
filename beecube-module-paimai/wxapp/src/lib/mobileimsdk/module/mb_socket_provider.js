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
 * 本地 WebSocket 实例封装实用类（基于微信小程序原生WebSocket，无任何第3方库依赖）。
 *
 * 本类提供存取本地WebSocket通信对象引用的方便方法，封装了WebSocket有效性判断以及异常处理等，以便确
 * 保调用者通过方法 {@link #getLocalSocket()}拿到的Socket对象是健康有效的。
 *
 * 依据作者对MobileIMSDK API的设计理念，本类将以单例的形式提供给调用者使用。
 *
 * @author Jack Jiang(http://www.52im.net/thread-2792-1-1.html)
 */
class ModuleMBSocketProvider {

  // 构造器（相当于java里的构造方法）
  constructor(argument) {
    this.TAG = "MBSocketProvider";

    /* 本地WebSocket对象引用 */
    this.localSocket = null;

    /*
     * 连接完成后将被通知的观察者。如果设置本参数，则将在连接完成后调用1次，调用完成后置null。
     * <p>
     * 设置本观察者的目的，是因为WebSocket连接的过程是异常完成，有时希望在连接完成时就能立即执行想
     * 要的逻辑，那么设置本观察者即可（在某次连接最终完成前，本参数的设置都会覆盖之前的设置，因为
     * 只有这一个观察者可以用哦）。
     */
    this.connectionDoneCallback = null;
  }

  /**
   * 设置连接完成后将被通知的回调函数。如果设置本参数，则将在连接完成后调用1次，调用完成后置null。
   * <p>
   * 设置本回调函数的目的，是因为WebSocket连接的过程是异常完成，有时希望在连接完成时就能立即执行想
   * 要的逻辑，那么设置本观察者即可（在某次连接最终完成前，本参数的设置都会覆盖之前的设置，因为
   * 只有这一个观察者可以用哦）。
   *
   * @param connectionDoneCallback 回调函数
   */
  setConnectionDoneCallback(connectionDoneCallback) {
    this.connectionDoneCallback = connectionDoneCallback;
  }

  /**
   * 重置并新建一个全新的WebSocket对象。
   *
   * @return {WebSocket} 新建的全新Socket对象引用
   */
  resetLocalSocket() {
    try {
      // 先无条件关闭socket（如果它还存在的话）
      this.closeLocalSocket();
      // 尝试连接服务器
      this.tryConnectToHost();
      // 返回新建立的连接对象引用
      return this.localSocket;
    } catch (e) {
      wx.MBUtils.mblog_w(this.TAG, "重置localSocket时出错，原因是：" + e);
      // 无条件关闭socket（如果它还存在的话）
      this.closeLocalSocket();
      return null;
    }
  }

  /**
   * 尝试发起连接并获取WebSocket。
   *
   * @return boolean
   */
  tryConnectToHost() {
    if (wx.MBCore.debugEnabled())
      wx.MBUtils.mblog_d(this.TAG, "tryConnectToHost并获取connection开始了...");

    var done = false;
    var that = this;

    //* 微信小程序的WebSocket API文档请见：
    //* https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html

    try {
      //## 创建微信小程序WebSocket实例👇
      //   微信小程序只支持wss协议，详见：https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html
      this.localSocket = wx.connectSocket({
        url: wx.MBCore.getWebsocketUrl(),
        header: {'content-type': 'text/xml'},//'application/json'},
        success: (res) => {
          wx.MBUtils.mblog_d(this.TAG, "WS.connectSocket - success (res=" + JSON.stringify(res) + ")！");
        },
        fail: (err) => {
          wx.MBUtils.mblog_w(this.TAG, "WS.connectSocket - fail (err=" + err + ")！");
        }
      })

      //## 微信小程序WebSocket连接建立时的回调处理👇
      //   注意：在标准HTML5的WebSocket API中，开发者直接设置onopen回调函数即可，而微信小程中的回调是通onOpen的参数传过去的，这是二者API最大的区别！
      this.localSocket.onOpen((res) => {
        if (wx.MBCore.debugEnabled()) {
          wx.MBUtils.mblog_d(this.TAG, "WS.onopen - 连接已成功建立！(isLocalSocketReady=" + that.isLocalSocketReady() + ")");
        }

        // 连接结果回调通知
        if (that.connectionDoneCallback) {
          that.connectionDoneCallback(true);
          // 调用完成马上置空，确保本观察者只被调用一次
          that.connectionDoneCallback = null;
        }
      })

      //## 微信小程序WebSocket连接关闭时的回调处理👇
      this.localSocket.onClose((res) => {
        if (wx.MBCore.debugEnabled()) {
          wx.MBUtils.mblog_d(this.TAG, "WS.onclose - 连接已断开。。。。(isLocalSocketReady=" + that.isLocalSocketReady() +
            ", MBClientCoreSDK.connectedToServer=" + wx.MBCore.isConnectedToServer() + ")", res);
        }

        // 用于快速响应连接断开事件，第一时间反馈给上层，提升用户体验
        if (wx.MBCore.isConnectedToServer()) {
          if (wx.MBCore.debugEnabled)
            wx.MBUtils.mblog_d(this.TAG, "WS.onclose - 连接已断开，立即提前进入框架的“通信通道”断开处理逻辑(而不是等心跳线程探测到，那就已经比较迟了)......");

          // 进入框架的“通信通道”断开处理逻辑（即断开回调通知）
          wx.MBKeepAliveDaemon.notifyConnectionLost();
        }
      })

      //## 微信小程序WebSocket发生错误时的回调处理👇
      this.localSocket.onError((res) => {
        // if(MBClientCoreSDK.debugEnabled())
        wx.MBUtils.mblog_e(this.TAG, "WS.onerror - 异常被触发了，原因是：", (res ? res.errMsg : 'unkown'));

        if (that.localSocket)
          that.localSocket.close();
      })

      //## 微信小程序WebSocket收到数据时的回调处理👇
      this.localSocket.onMessage((res) => {
        let protocalJsonStr = (res ? (res.data ? res.data : null) : null);

        if (wx.MBCore.debugEnabled())
          wx.MBUtils.mblog_d(this.TAG, "WS.onmessage - 收到消息(原始内容)：" + protocalJsonStr);

        // 读取收到的数据 Protocal 对象
        let pFromServer = (protocalJsonStr ? JSON.parse(protocalJsonStr) : null);

        // 进入消息调度和处理逻辑
        wx.MBDataReciever.handleProtocal(pFromServer);
      })

      done = true
    } catch (e) {
      wx.MBUtils.mblog_w(this.TAG, "连接Server(" + this._websocketUrl + ")失败：", e)
    }

    return done
  }

  /**
   * 本类中的WebSocket对象是否是健康的。
   *
   * @return {boolean} true表示是健康的，否则不是
   */
  isLocalSocketReady() {
    // 有关WebSocket的readyState状态说明，请见：
    // https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/readyState
    return this.localSocket != null && this.localSocket.readyState === 1;
  }

  /**
   * 获得本地WebSocket的实例引用.
   * <p>
   * 本方法内封装了WebSocket有效性判断以及异常处理等，以便确保调用者通过本方法拿到的WebSocket对象是健康有效的。
   *
   * @return {WebSocket} 如果该实例正常则返回它的引用，否则返回null
   * @see #isLocalSocketReady()
   * @see #resetLocalSocket()
   */
  getLocalSocket() {
    if (this.isLocalSocketReady()) {
      // TODO: 注释掉log！
      if (wx.MBCore.debugEnabled())
        wx.MBUtils.mblog_d(this.TAG, "isLocalSocketReady()==true，直接返回本地socket引用哦。");
      return this.localSocket;
    } else {
      // TODO: 注释掉log！
      if (wx.MBCore.debugEnabled())
        wx.MBUtils.mblog_d(this.TAG, "isLocalSocketReady()==false，需要先resetLocalSocket()...");
      return this.resetLocalSocket();
    }
  }

  /**
   * 强制关闭本地WebSocket。
   * 一旦调用本方法后，再次调用{@link #getLocalSocket()}将会返回一个全新的WebSocket对象引用。
   *
   * 本方法通常在两个场景下被调用：
   * 1) 真正需要关闭WebSocket时（如所在的浏览器退出时）；
   * 2) 当调用者检测到网络发生变动后希望重置以便获得健康的WebSocket引用对象时。
   */
  closeLocalSocket() {
    if (wx.MBCore.debugEnabled())
      wx.MBUtils.mblog_d(this.TAG, "正在closeLocalSocket()...");

    if (this.localSocket) {
      try {
        // 关闭socket
        this.localSocket.close();
        this.localSocket = null;
      } catch (e) {
        wx.MBUtils.mblog_w(this.TAG, "在closeLocalSocket方法中试图释放localSocket资源时：", e);
      }
    } else {
      wx.MBUtils.mblog_d(this.TAG, "Socket处于未初化状态（可能是您还未登陆），无需关闭。");
    }
  }
}

// 以全局单例的形式存在，方便使用
wx.MBSocketProvider = new ModuleMBSocketProvider();//MBSocketProvider;
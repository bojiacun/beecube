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
 * 一个简单的事件总线实现类（通过此类实现SDK层与Page界面层的代码解偶）。
 * 
 * @author 来自网络 & JackJiang(http://www.52im.net/space-uid-1.html)
 */
class EventBus {
  constructor() {
    this.dispCbs = [];
    this.dispIns = [];
    this.dispIns.push(this);
    this.dispCbs.push({});
  }

  /**
   * 注册事件接收者。
   * 
   * @param {*} type 
   * @param {*} cb 
   */
  register(type, cb) {
    let cbtypes = this.dispCbs[this.dispIns.indexOf(this)];
    let cbs = cbtypes[type] = cbtypes[type] || [];
    if (!~cbs.indexOf(cb)) {
      cbs.push(cb);
    }
  }

  /**
   * 取消注册事件接收者。
   * 
   * @param {*} type 
   * @param {*} cb 
   */
  unregister(type, cb) {
    let cbtypes = this.dispCbs[this.dispIns.indexOf(this)];
    let cbs = cbtypes[type] = cbtypes[type] || [];
    let curTypeCbIdx = cbs.indexOf(cb);
    if (~curTypeCbIdx) {
      cbs.splice(curTypeCbIdx, 1);
    }
  }

  /**
   * 发出事件。
   * 
   * @param {*} type 
   * @param  {...any} args 
   */
  post(type, ...args) {
    let cbtypes = this.dispCbs[this.dispIns.indexOf(this)];
    let cbs = cbtypes[type] = cbtypes[type] || [];

    for (let i = 0; i < cbs.length; i++) {
      cbs[i].apply(null, args);
    }
  }
}

// 全局单例，方便使用
module.exports = new EventBus();
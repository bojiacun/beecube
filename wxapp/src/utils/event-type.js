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
 * 应用层事件类型常量对象（SDK中发生的网络回调事件将以事件通知的形式通知UI页面）。
 *
 * @author JackJiang(http://www.52im.net/space-uid-1.html)
 */
const EventType = {
    // 收到聊天消息事件通知
    onIMData: 'event2ui.onIMData',
    // 客户端成功登陆/认证事件通知
    onIMAfterLoginSucess: 'event2ui.onIMAfterLoginSucess',
    // 客户端登陆/认证失败事件通知
    onIMAfterLoginFailed: 'event2ui.onIMAfterLoginFailed',
    // 客户端与服务器的网络断开事件通知
    onIMDisconnected: 'event2ui.onIMDisconnected',
    // 客户端掉线重连成功事件通知
    onIMReconnectSucess: 'event2ui.onIMReconnectSucess',
    // 客户端已发出心跳包事件通知
    onIMPing: 'event2ui.onIMPing',
    // 客户端收到服务端的心跳响应包事件通知
    onIMPong: 'event2ui.onIMPong',
    // 聊天消息/指令未成功送达事件通知
    onMessagesLost: 'event2ui.onMessagesLost',
    // 聊天消息/指令已被对方收到事件通知
    onMessagesBeReceived: 'event2ui.onMessagesBeReceived',
    onMessageData: 'event2ui.onMessageData',
}

// 全局单例，方便使用
module.exports = EventType;

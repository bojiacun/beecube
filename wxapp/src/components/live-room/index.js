// components/live-room/index.js
import MessageType from "../../utils/message-type";
const numeral = require('numeral');
const app = getApp();

let networkOk = true;
let isLogout = false;
let logOutTer = null;
let playingList = [];
let merT = null;
let priseTotal = 0;
let iphoneXX = false;
let iphone6s = false;
let iphones = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11'];

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isNative: {
            type: Boolean,
            value: false
        },
        pushMerTime: {
            type: Number,
            value: 10
        },
        liveRoom: {
            type: Object,
            value: null,
            observer: function (newVal, oldVal, changedPath) {
            }
        },
        streams: {
            type: Array,
            value: [],
            observer: function (newVal, oldVal, changedPath) {

            }
        },
        userID: {
            type: String,
            value: ""
        },
        isImReady: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal, changedPath) {
                if (newVal) {
                    this.loginRoom();
                }
            }
        },
        settings: {
            type: Object,
            value: {}
        },
        preferPublishSourceType: {
            type: Number,
            value: 1
        },
        preferPlaySourceType: {
            type: Number,
            value: 1
        },
        navBarHeight: {
            type: Number,
            value: 0
        }
    },
    /**
     * 页面的初始数据
     */
    data: {
        isCaster: true,
        appId: '',
        roomName: "", // 房间名
        userName: "", // 当前初始化的用户名
        anchorID: "", // 主播 ID
        publishStreamID: "", // 推流 ID
        playStreamList: [], // 拉流流信息列表，列表中每个对象结构为 {anchorID:'xxx', streamID:'xxx', playContext:{}, playUrl:'xxx', playingState:'xxx'}
        beginToPublish: false, // 准备连麦标志位
        reachStreamLimit: false, // 房间内达到流上限标志位
        isPublishing: false, // 是否正在推流
        playConfig: {},
        pictureInPictureMode: ['push', 'pop'],
        upperStreamLimit: 2, // 房间内限制为最多 4 条流，当流数大于 4 条时，禁止新进入的用户连麦
        inputMessage: "",
        isMessageHide: true,
        scrollToView: "",
        tryPlayCount: 0,
        streams: [],
        requestJoinLiveList: [],    // 请求连麦的成员列表
        messageList: [], // 消息列表，列表中每个对象结构为 {name:'xxx', time:xxx, content:'xxx'}
        userCount: 1,
        reMsgCount: 0,
        imColors: ["#FFC000", "#AAFF6C", "#63E3FF", "#FF7920"],
        newestName: "",
        inputShow: false,
        offerShow: false,
        inputBottom: 0,
        preInputShow: true,
        goods: null,
        clearHide: true,
        keyboardHold: true,
        nextPrice: 0.00,
        newBot: 568,
        meBot: 140,
        mmBot: 0,
        muted: false,
        userTop: 0,
        userInfo: {},
        hasUserInfo: false,
        loginedRoom: false,
        waitingImage: null,
        avatarUrl: "",
        nickName: "",
        playUrl: "",
        showBeauty: false,
        sid: "",
        isFull: false,
        isConnecting: false,
        subPushContext: null,
        requestId: '',
        isShowModal: false,
        showDesc: '',
        hasConfirm: true,
        hasCancel: true,
        confirmText: '同意',
        cancelText: '拒绝',
        kitoutUser: ''
    },
    created: function () {
        const sysInfo = wx.getSystemInfoSync();
        if (sysInfo.model && iphones.some(item => sysInfo.model.indexOf(item) > -1)) {
            iphoneXX = true;
        }
        if (sysInfo.platform === 'ios' && sysInfo.windowHeight == 667 && sysInfo.windowWidth == 375) {
            iphone6s = true;
        }
    },
    ready: function () {
    },
    lifetimes: {
        attached() {
            console.log('live-room attached');
        },
        detached() {
            console.log('live-room detached');
            this.logoutRoom();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        init() {
            this.getUserInfo();
            let appId = wx.getExtConfigSync().appId;
            // iphoneX 等机型
            if (iphoneXX) {
                this.data.mmBot += 48;
                this.data.meBot += 48;
                this.data.newBot += 48;
                this.setData({
                    mmBot: this.data.mmBot,
                    meBot: this.data.meBot,
                    newBot: this.data.newBot
                })
            }
            let userTop = this.data.navBarHeight;

            let timestamp = new Date().getTime();
            const nickName = this.data.userInfo.nickname ? this.data.userInfo.nickname : 'xcxU' + timestamp;
            const avatar = this.data.userInfo.avatar ? this.data.userInfo.avatar : '../images/avatar-logo.png';
            const nickAvatar = {
                nickName: nickName,
                avatar: avatar
            }
            this.setData({
                userTop,
                roomName: this.data.roomID,
                userName: JSON.stringify(nickAvatar),
                isCaster: this.data.loginType !== 'audience',
                appId: appId,
            });
            this.bindCallBack(); //监听zego-sdk回调
            this.onNetworkStatus();
            // 保持屏幕常亮
            wx.setKeepScreenOn({
                keepScreenOn: true
            });
        },
        getData() {
            return this.data;
        },
        setNewBot(newBot) {
            this.setData({newBot: newBot});
        },
        getUserInfo() {
            let userInfo = app.globalData.userInfo;
            if (userInfo) {
                this.setData({
                    hasUserInfo: true,
                    userInfo: userInfo
                });
            }
        },
        bindCallBack() {
            let self = this;
        },
        checkParam() {
            return true;
        },
        loginRoom() {
            if (!this.checkParam()) return;
            //用户登录房间
            let message = {roomId: this.data.liveRoom.id, appId: this.data.appId};
            // 构建消息的通信协议包（这是SDK底层传输数据的原始数据包对象）
            let p = wx.MBProtocalFactory.createCommonDataSimple(JSON.stringify(message), wx.IMSDK.getLoginInfo().loginUserId, "0", MessageType.JOIN_ROOM);
            // 将消息通过websocket发送出去
            console.log('执行登录房间操作，发送消息', p);
            wx.IMSDK.sendData(p);
        },
        //输入聚焦
        foucus: function (e) {
            var that = this;
            let inputBot = e.detail.height;
            if (iphone6s) {
                if (210 < inputBot && inputBot < 220) {
                    inputBot = e.detail.height + 42;
                }
            }
            that.setData({
                inputBottom: inputBot
            })
        },

        doOffer: function() {
            this.triggerEvent('RoomEvent', {
                tag: 'doOffer',
                content: {price: this.data.nextPrice}
            })
        },
        payDeposit: function() {
            this.triggerEvent('RoomEvent', {
                tag: 'payDeposit',
                content: {}
            })
        },
        showOffer: function(goods, deposited) {
            this.setData({
                inputBottom: this.data.mmBot,
                offerShow: true,
                inputShow: false,
                preInputShow: false,
                deposited: deposited
            });
            this.getNextPrice(goods);
        },

        getNextPrice(goods) {
            let upgradeConfig = JSON.parse(goods.uprange);
            console.log('重新计算拍品的下一次出价钱数', goods);
            const {settings} = this.data;
            if (parseInt(settings.isDealCommission) === 1) {
                if (parseFloat(goods.commission) > 0.00 && goods.state === 3) {
                    //落槌价显示佣金
                    const commission = goods.commission/100;
                    goods.dealPrice = (goods.dealPrice + (goods.dealPrice * commission));
                }
            }
            if (!goods.currentPrice) {
                //说明没有人出价，第一次出价可以以起拍价出价
                this.setData({nextPrice: goods.startPrice, goods: goods});
                return;
            }
            let currentPrice = parseFloat(goods.currentPrice);

            let rangePrice = 0;
            for (let i = 0; i < upgradeConfig.length; i++) {
                let config = upgradeConfig[i];
                let min = parseFloat(config.min);
                let price = parseFloat(config.price);
                if (currentPrice >= min) {
                    rangePrice = price;
                }
            }
            this.setData({nextPrice: currentPrice + rangePrice, goods: goods});
        },

        //失去聚焦
        blur: function (e) {
            var that = this;
            that.setData({
                inputBottom: 0
            })
        },
        clickMessage() {
            console.log('clickMessage');
            this.clickFull();
        },
        scrollMessage() {
            console.log('scrollMessage');
        },
        clickFull() {
            console.log('clickFull')
            this.setData({
                inputShow: false,
                preInputShow: true,
                offerShow: false,
            });
            this.triggerEvent('RoomEvent', {
                tag: 'onModalClick',
                content: {}
            })
        },
        showInput() {
            console.log('showInput');
            this.setData({
                inputShow: true,
                offerShow: false,
                preInputShow: false,
            });
        },
        showMerchandise() {
            console.log('showMerchandise');
            this.triggerEvent('RoomEvent', {
                tag: 'onMerchandise',
                content: '',
            });
        },
        onMessageReceived(message) {
            console.log('收到了房间消息', message);
            let uiMessage = {id: message.id};
            switch (message.type) {
                //加入直播间消息
                case MessageType.JOIN_ROOM:
                    if (message.isme) {
                        //如果是自己登录房间成功，则设置状态
                        this.setData({loginedRoom: true});
                    }
                    //UI显示谁登录成功了
                    this.setData({newestName: message.userName, userCount: message.roomUsers});
                    setTimeout(()=>{
                        this.setData({newestName: null});
                    }, 3000);
                    break;
                case MessageType.ROOM_NOTICE:
                    uiMessage.color = '#FF0000';
                    uiMessage.fontColor = '#10B981';
                    uiMessage.name = '系统公告';
                    uiMessage.content = message.notice;

                    this.pushUiMessage(uiMessage);
                    break;
                case MessageType.OFFER:
                    uiMessage.content = `出价 ${numeral(message.price).format('0,0.00')} 元`;
                    uiMessage.name = message.userName;
                    uiMessage.fontColor = '#FF0000';
                    this.pushUiMessage(uiMessage);
                    break;
                case MessageType.SPEAK:
                    if(message.isme) {
                        return;
                    }
                    uiMessage.content = message.content;
                    uiMessage.name = message.userName;
                    this.pushUiMessage(uiMessage);
                    break;
                case MessageType.SHUTUP:
                    wx.showToast({
                        title: "您已被禁言",
                        icon: 'none',
                        duration: 2000
                    });
                    //被禁言了
                    this.setData({muted: true});
                    break;
            }
        },
        pushUiMessage(message) {
            this.data.messageList.push(message);
            this.setData({
                messageList: this.data.messageList,
                scrollToView: 'M'+message.id,
            });
        },
        onComment() {
            console.log('>>>[liveroom-room] begin to comment', this.data.inputMessage);
            if (!this.data.inputMessage.trim()) {
                this.showInput();
                wx.showToast({
                    title: "您还没有输入内容",
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            if (!this.data.loginedRoom) {
                wx.showToast({
                    title: "登录房间失败，无法发送消息",
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            if(this.data.muted) {
                wx.showToast({
                    title: "您已被禁言",
                    icon: 'none',
                    duration: 2000
                });
                return
            }
            const msgContent = this.data.inputMessage;
            this.setData({
                clearHide: true,
                inputShow: false,
                keyboardHold: true,
                inputMessage: "",
            })
            // wx.cloud.init();
            // wx.cloud.callFunction({
            //   name:'msgcheck',
            //   data:{
            //     content: msgContent
            //   }
            // }).then(ckres=>{

            //审核通过之后的操作 if == 0
            // if (ckres.result.errCode == 0){
            let message = {
                roomId: this.data.liveRoom.id,
                appId: this.data.appId,
                content: msgContent,
                userInfo: this.data.userInfo,
                id: 'M' + this.data.userID + Date.parse(new Date()),
                name: '我',
                color: '#FF4EB2'
            };
            this.pushUiMessage(message);

            // 聊天消息接收者
            let receiver = '0';
            let sendMessage = {
                content: msgContent,
                userName: this.data.userInfo.nickname,
                roomId: this.data.liveRoom.id,
                appId: this.data.appId,
                id:message.id,
            };

            // 网络连接正常的情况下才允许发送消息哦
            if (receiver && sendMessage && wx.IMSDK.isOnline()) {
                // 构建消息的通信协议包（这是SDK底层传输数据的原始数据包对象）
                let p = wx.MBProtocalFactory.createCommonDataSimple(JSON.stringify(sendMessage), wx.IMSDK.getLoginInfo().loginUserId, receiver, MessageType.SPEAK);
                // 将消息通过websocket发送出去
                wx.IMSDK.sendData(p);
            } else {
                if (!receiver) {
                    wx.MBUtils.alert('消息接收者是空的！');
                } else if (!sendMessage) {
                    wx.MBUtils.alert('要发送的内容是空的！');
                } else if (!wx.IMSDK.isOnline()) {
                    wx.MBUtils.alert('online==false, 当前已离线，无法发送消息！');
                }
            }

        },
        onNetworkStatus() {

        },
        bindMessageInput: function (e) {
            this.data.inputMessage = e.detail.value;
            if (this.data.inputMessage !== '') {
                this.setData({
                    clearHide: false,
                    keyboardHold: false
                })
            } else {
                this.setData({
                    clearHide: true,
                    keyboardHold: true
                })
            }
        },
        clearInput: function (e) {
            this.setData({
                inputMessage: '',
                clearHide: true,
                keyboardHold: true
            })
        },
        pushMer(indx) {
            console.log('indx', indx);
        },
        back() {
            const content = {}
            this.triggerEvent('RoomEvent', {tag: 'onBack', content});
        },
        logoutRoom() {
        },


        toggleShowBeauty() {
            this.setData({
                showBeauty: !this.data.showBeauty
            })
        },
        handleChangeBeauty(e) {
            this.setData({
                beauty: e.detail.value
            })
        },
        handleChangeWhiteness(e) {
            this.setData({
                whiteness: e.detail.value
            })
        },

        confirm(e) {
            console.log(e);
            let self = this;
            self.setData({
                isShowModal: false
            })
            if (self.data.modalType === 'requestJoin') {
                self.confirmJoin()
            } else if (self.data.modalType === 'endLive') {
                self.endJoinLive();
            }
        },
        cancel(e) {
            console.log(e);
            let self = this;
            self.setData({
                isShowModal: false
            })
            if (self.data.modalType === 'requestJoin') {
                self.cancelJoin()
            }
        },
        onPlayError(e) {
            console.log('play error', e);
        },
        onWaiting(e) {
            console.log('waiting', e);
        }
    }
});

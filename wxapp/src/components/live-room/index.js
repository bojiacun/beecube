// components/live-room/index.js
import MessageType from "../../utils/message-type";

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
        inputBottom: 0,
        clearHide: true,
        keyboardHold: true,

        newBot: 568,
        meBot: 140,
        mmBot: 0,

        userTop: 0,
        userInfo: {},
        hasUserInfo: false,

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
        console.log("ready", this.data.liveAppID, this.data);
    },
    lifetimes: {
        attached() {
            console.log('live-room attached');
        },
        detached() {
            console.log('live-room detached');
            if (zg) {
                this.logoutRoom();
            }
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
            console.log('用户登录房间');
            if (!this.checkParam()) return;
            //用户登录房间
            let message = {roomId: this.data.liveRoom.id, appId: this.data.appId};
            // 构建消息的通信协议包（这是SDK底层传输数据的原始数据包对象）
            let p = wx.MBProtocalFactory.createCommonDataSimple(JSON.stringify(message), wx.IMSDK.getLoginInfo().loginUserId, "0", MessageType.JOIN_ROOM);
            // 将消息通过websocket发送出去
            wx.IMSDK.sendData(p);
        },
        //输入聚焦
        foucus: function (e) {
            var that = this;
            console.log(e, iphone6s);
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
            if (this.data.inputShow) {
                this.setData({
                    inputShow: false
                });
            }
            ;
            this.triggerEvent('RoomEvent', {
                tag: 'onModalClick',
                content: {}
            })
        },
        showInput() {
            console.log('showInput');
            this.setData({
                inputShow: true
            });
        },
        switchCamera() {
            this.data.mainPusher.frontCamera = !this.data.mainPusher.frontCamera;
            this.setData({
                mainPusher: this.data.mainPusher,
            });
            if (this.data.isNative) {
                this.data.pusherContext && this.data.pusherContext.switchCamera();
            } else {
                zgPusher && zgPusher.switchCamera();
            }
        },
        enableMute() {
            this.data.mainPusher.isMute = !this.data.mainPusher.isMute;
            this.setData({
                mainPusher: this.data.mainPusher,
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
            let self = this;
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
                id: 'M'+Math.random()
            };

            console.log('>>>[liveroom-room] currentMessage', message);

            self.data.messageList.push(message);

            self.setData({
                messageList: self.data.messageList,
                scrollToView: message.id,
            });

            // 聊天消息接收者
            let receiver = '0';

            // 网络连接正常的情况下才允许发送消息哦
            if (receiver && message && wx.IMSDK.isOnline()) {
                // 构建消息的通信协议包（这是SDK底层传输数据的原始数据包对象）
                let p = wx.MBProtocalFactory.createCommonDataSimple(msgContent, wx.IMSDK.getLoginInfo().loginUserId, receiver, MessageType.SPEAK);
                // 将消息通过websocket发送出去
                wx.IMSDK.sendData(p);
            } else {
                if (!receiver) {
                    wx.MBUtils.alert('消息接收者是空的！');
                } else if (!message) {
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
            let self = this;
            zg.sendReliableMessage('merchandise',
                indx + '&' + this.data.pushMerTime,
                function (res) {
                    console.log('pushMer success', res);
                    const contents = {
                        indx,
                        merTime: self.data.pushMerTime,
                        merBot: self.data.mmBot + 140
                    }
                    self.triggerEvent('RoomEvent', {
                        tag: 'onRecvMer',
                        // code: 0,
                        content: contents
                    });
                    console.log(!!merT);
                    if (merT) {
                        clearTimeout(merT);
                        merT = null;
                    } else {
                        self.data.meBot += 120;
                        self.data.newBot += 120;
                        self.setData({
                            meBot: self.data.meBot,
                            newBot: self.data.newBot
                        });
                    }

                    merT = setTimeout(() => {
                        self.data.meBot -= 120;
                        self.data.newBot -= 120;
                        self.setData({
                            meBot: self.data.meBot,
                            newBot: self.data.newBot
                        })
                        clearTimeout(merT);
                        merT = null;
                    }, self.data.pushMerTime * 1000);
                    const content = {}
                    self.triggerEvent('RoomEvent', {
                        tag: 'onPushMerSuc',
                        // code: 0,
                        content
                    })
                },
                function (err) {
                    console.error('pushMer error', err)
                })
        },
        back() {
            const content = {}
            this.triggerEvent('RoomEvent', {tag: 'onBack', content});
        },
        logoutRoom() {
        },
        requestJoinLive() {
            let self = this;

            if (this.data.loginType === 'anchor') return;
            // 防止两次点击操作间隔太快
            let nowTime = new Date();
            if (nowTime - self.data.tapTime < 1000) {
                return;
            }
            self.setData({'tapTime': nowTime});

            // 正在发起连麦中，不处理
            if (self.data.beginToPublish === true) {
                console.log('>>>[liveroom-room] begin to publishing, ignore');
                return;
            }

            // 房间流已达上限，不处理
            if (self.data.reachStreamLimit === true) {
                console.log('>>>[liveroom-room] reach stream limit, ignore');
                self.setData({
                    isShowModal: true,
                    hasCancel: false,
                    hasConfirm: false,
                    showDesc: '主播正在连麦'
                })
                setTimeout(() => {
                    self.setData({
                        isShowModal: false
                    })
                }, 3000)
                return;
            }


            // 观众正在连麦时点击，则结束连麦
            if (self.data.isPublishing) {
                zg.endJoinLive(self.data.anchorID, function (result, userID, userName) {
                    console.log('>>>[liveroom-room] endJoinLive, result: ' + result);
                }, null);

                // 停止推流
                zg.stopPublishingStream(self.data.publishStreamID);

                self.setData({
                    isPublishing: false,
                    subPusher: {
                        ...self.data.subPusher,
                        ...{
                            streamID: '',
                            url: ''
                        }
                    }
                }, function () {
                    // 自己停止推流，不会收到流删减消息，所以此处需要主动调整视图大小
                });

                return;
            }

            // 观众未连麦，点击开始推流
            console.log('>>>[liveroom-room] audience requestJoinLive');
            self.setData({
                beginToPublish: true,
            });

            zg.requestJoinLive(self.data.anchorID, function (res) {
                console.log('>>>[liveroom-room] requestJoinLive sent succeeded');
            }, function (error) {
                console.log('>>>[liveroom-room] requestJoinLive sent failed, error: ', error);
            }, function (result, userID, userName) {
                console.log('>>>[liveroom-room] requestJoinLive, result: ' + result);

                // 待补充，校验 userID
                if (result === false) {
                    wx.showToast({
                        title: '主播拒绝连麦',
                        icon: 'none',
                        duration: 2000
                    });

                    self.setData({
                        beginToPublish: false,
                    })
                } else {
                    // 主播同意了连麦，但此时已经达到了房间流上限，不再进行连麦
                    if (self.data.reachStreamLimit) {
                        self.setData({
                            beginToPublish: false,
                        });
                        return;
                    }

                    wx.showToast({
                        title: '主播同意连麦，准备推流',
                        icon: 'none',
                        duration: 2000
                    });

                    // 主播同意连麦后，观众开始推流
                    console.log('>>>[liveroom-room] startPublishingStream, userID: ' + userID + ', publishStreamID: ' + self.data.publishStreamID);
                    zg.setPreferPublishSourceType(self.data.preferPublishSourceType);
                    zg.startPublishingStream(self.data.publishStreamID);
                    self.setData({
                        isConnecting: true
                    });
                }
            });
        },
        handleMultiJoinLive(requestJoinLiveList, requestId, self) {
            for (let i = 0; i < requestJoinLiveList.length; i++) {
                if (requestJoinLiveList[i] != requestId) {
                    // 新的连麦弹框会覆盖旧的弹框，拒绝被覆盖的连麦请求
                    zg.respondJoinLive(requestJoinLiveList[i], false);
                }
            }
        },
        endJoinLive() {
            let self = this;
            if (this.data.loginType === 'anchor') {
                zg.endJoinLive(this.data.kitoutUser, function (result, userID, userName) {
                    console.log('>>>[liveroom-room] endJoinLive, result: ' + result);

                }, function (err, seq) {
                    console.log('requestJoinLive err', err, seq);
                });

                self.data.playStreamList.forEach(item => {
                    zg.stopPlayingStream(item.streamID);
                    item['playUrl'] = '';
                })
                self.setData({
                    kitoutUser: '',
                    isConnecting: false,
                    playStreamList: []
                });
                playingList = [];
            } else if (this.data.loginType === 'audience') {
                zg.endJoinLive(self.data.anchorID, function (result, userID, userName) {
                    console.log('>>>[liveroom-room] endJoinLive, result: ' + result);
                }, function (err, seq) {
                    console.log('requestJoinLive err', err, seq);
                });
                zg.stopPublishingStream(self.data.publishStreamID);
                self.setData({
                    isConnecting: false,
                    pushUrl: ''
                })
            }

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
        confirmJoin() {
            let self = this
            console.log('>>>[liveroom-room] onRecvJoinLiveRequest accept join live');
            console.log('>>>[liveroom-room] onRecvJoinLiveRequest ', self.data.isConnecting, self.data.reachStreamLimit, self.data.requestId);

            if (self.data.isConnecting) return;

            // 已达房间上限，主播依然同意未处理的连麦，强制不处理
            if (self.data.reachStreamLimit) {
                wx.showToast({
                    title: '房间内连麦人数已达上限，不建立新的连麦',
                    icon: 'none',
                    duration: 2000
                });
                zg.respondJoinLive(self.data.requestId, false); // true：同意；false：拒绝
            } else {
                zg.respondJoinLive(self.data.requestId, true); // true：同意；false：拒绝
                self.setData({
                    isConnecting: true
                })
            }
            self.handleMultiJoinLive(self.data.requestJoinLiveList, self.data.requestId, self);
        },
        cancelJoin() {
            let self = this
            console.log('>>>[liveroom-room] onRecvJoinLiveRequest refuse join live');
            zg.respondJoinLive(self.data.requestId, false); // true：同意；false：拒绝

            self.handleMultiJoinLive(self.data.requestJoinLiveList, self.data.requestId, self);
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
        endLive(e) {
            let content = '确认结束连麦？'
            this.setData({
                isShowModal: true,
                showDesc: content,
                modalType: 'endLive',
                confirmText: '是',
                cancelText: '否',
                kitoutUser: e.target.dataset.userid,
            })

        },
        onPushStateChange(e) {
            console.log('onPushStateChange', e);
            console.log(
                '>>>[liveroom-room] onPushStateChange, code: ' +
                e.detail.code +
                ', message:' +
                e.detail.message
            );
            // console.log('onPushStateChange', e.detail.detail.code);
            zg && zg.updatePlayerState(this.data.publishStreamID, e);
        },
        onPushNetStateChange(e) {
            zg && zg.updatePlayerNetStatus(this.data.publishStreamID, e);
        },
        onPlayStateChange(e) {
            console.log('onPlayStateChange', e);
            console.log(
                '>>>[liveroom-room] onPlayStateChange, code: ' +
                e.detail.code +
                ', message:' +
                e.detail.message
            );
            if (this.data.isNative) {
                zg && zg.updatePlayerState(e.target.id, e);
            } else {
                zg && zg.updatePlayerState(e.detail.streamID, e);
            }
        },
        onPlayNetStateChange(e) {
            console.log('play error', e);
        },
        onPushError: function (ev) {
            console.error(ev);
        }
    }
});

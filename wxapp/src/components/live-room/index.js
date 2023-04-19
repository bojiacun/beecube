// components/live-room/index.js
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
        liveAppID: {
            type: Number,
            value: 1739272706,
            observer: function (newVal, oldVal) {
            }
        },
        wsServerURL: {
            type: String,
            value: ''
        },
        logServerURL: {
            type: String,
            value: ""
        },
        loginType: {
            type: String,
            value: ""
        },
        pushMerTime: {
            type: Number,
            value: 10
        },
        roomID: {
            type: String,
            value: "",
            observer: function (newVal, oldVal, changedPath) {
            }
        },
        userID: {
            type: String,
            value: ""
        },
        token: {
            type: String,
            value: "",
            observer: function (newVal, oldVal, changedPath) {
                if (newVal !== '') {
                    this.loginRoom(newVal);
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
                publishStreamID: "xcxS" + timestamp,
                isCaster: this.data.loginType !== 'audience'
            });
            if (this.data.loginType === 'anchor') {
                this.setData({
                    avatarUrl: avatar,
                    nickName: nickName
                })
            }

            this.bindCallBack(); //监听zego-sdk回调

            console.log(
                ">>>[liveroom-room] publishStreamID is: " + this.data.publishStreamID
            );

            console.log('token', this.data.token)

            this.onNetworkStatus();
            // 保持屏幕常亮
            wx.setKeepScreenOn({
                keepScreenOn: true
            });
        },
        getUserInfo() {
            let userInfo = app.globalData.userInfo;
            console.log('getUserInfo', userInfo);
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
        loginRoom(token) {
            let self = this;
            console.log(
                ">>>[liveroom-room] login room, roomID: " + self.data.roomID,
                ", userID: " + self.data.userID + ", userName: " + self.data.userName + ", token: " + token
            );
            if (!this.checkParam()) return;
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
        setPushUrl(streamID, url) {
            console.log('>>>[liveroom-room] setPushUrl: ', url);
            let self = this;

            if (!url) {
                console.log('>>>[liveroom-room] setPushUrl, url is null');
                return;
            }

            // 主播推流
            if (this.data.isCaster) {
                this.setData({
                    mainPusher: {
                        ...this.data.mainPusher,
                        ...{
                            streamID,
                            url: url
                        }
                    }
                }, () => {
                    if (this.data.isNative) {
                        this.data.pusherContext = wx.createLivePusherContext();
                        setTimeout(() => {
                            this.data.pusherContext.start();
                            console.log('start');
                        }, 10);
                    } else {
                        zgPusher = this.selectComponent("#zg-pusher");
                        console.log('zgPusher', zgPusher);
                        zgPusher.start();
                    }
                });
            } else { // 子主播推流
                this.setData({
                    subPusher: {
                        ...this.data.subPusher,
                        ...{
                            streamID,
                            url: url
                        }
                    }
                })
            }

        },

        setPlayUrl(streamid, url) {
            console.log('>>>[liveroom-room] setPlayUrl: ', url);
            let self = this;
            if (!url) {
                console.log('>>>[liveroom-room] setPlayUrl, url is null');
                return;
            }

            let founded = false, isHost = false;
            let streamInfo = {};
            console.log('playingList', playingList.length);
            playingList.forEach(item => {
                if (item.stream_id === streamid) {
                    streamInfo['streamID'] = streamid;
                    streamInfo['playUrl'] = url;
                    streamInfo['anchorID'] = item.anchor_id_name;
                    founded = true;
                }
            });
            console.log(founded, streamInfo);
            if (!founded) return;
            console.log('pusherID', self.data.mainPusher.pusherID);
            if (streamInfo.anchorID === self.data.mainPusher.pusherID) {
                self.setData({
                    mainPusher: {
                        ...self.data.mainPusher,
                        ...{
                            streamID: streamInfo.streamID,
                            url: streamInfo.playUrl,
                            pusherID: streamInfo.anchorID
                        }
                    }
                }, () => {
                    if (self.data.isNative) {
                        this.data.playerContext = wx.createLivePlayerContext(streamInfo.streamID, self);
                        console.log(self.data.mainPusher, this.data.playerContext)
                        setTimeout(() => {
                            this.data.playerContext.play()
                        }, 10)
                    } else {
                        console.log('zgPlayer', zgPlayer)
                        zgPlayer = this.selectComponent("#zg-player");
                        setTimeout(() => {
                            zgPlayer && zgPlayer.play();
                        }, 100)
                    }

                })
            } else {
                self.data.playStreamList.push(streamInfo);
                self.setData({
                    playStreamList: self.data.playStreamList
                });
            }

        },

        startPlayingStreamList(streamList) {
            let self = this;

            if (streamList.length === 0) {
                console.log(
                    '>>>[liveroom-room] startPlayingStream, streamList is null'
                );
                return;
            }

            zg.setPreferPlaySourceType(self.data.preferPlaySourceType);

            console.log(
                '>>>[liveroom-room] startPlayingStream, preferPlaySourceType: ',
                self.data.preferPlaySourceType
            );
            console.log('startPlayingStreamList', self.data.sid, self.data.playStreamList);

            if (self.data.loginType === 'anchor') {
                if (self.data.playStreamList.length) return;
                let streamID = streamList[0].stream_id;
                if (!playingList.some(playItem => playItem.stream_id === streamID)) {
                    playingList.push(streamList[0]);
                    zg.startPlayingStream(streamID);
                }
            } else if (self.data.loginType === 'audience') {

                isLogout = streamList.find(item => item.stream_id === self.data.mainPusher.streamID);
                // 获取每个 streamID 对应的拉流 url
                for (let i = 0; i < streamList.length; i++) {
                    let streamID = streamList[i].stream_id;
                    let anchorID = streamList[i].anchor_id_name; // 推这条流的用户id
                    console.log(
                        '>>>[liveroom-room] startPlayingStream, playStreamID: ' +
                        streamID +
                        ', pushed by : ' +
                        anchorID
                    );
                    console.log('playingList', playingList);
                    if (!playingList.some(playItem => playItem.stream_id === streamID)) {
                        console.log('no exist')
                        playingList.push(streamList[i]);
                        console.log('playingList', playingList);
                        zg.startPlayingStream(streamID);

                    }
                }
            }
        },

        stopPlayingStreamList(streamList) {
            let self = this;

            if (streamList.length === 0) {
                console.log(
                    '>>>[liveroom-room] stopPlayingStream, streamList is empty'
                );
                return;
            }

            for (let i = 0; i < streamList.length; i++) {
                let streamID = streamList[i].stream_id;
                console.log(
                    '>>>[liveroom-room] stopPlayingStream, playStreamID: ' + streamID
                );
                zg.stopPlayingStream(streamID);

                if (streamID === self.data.mainPusher.streamID) {
                    if (self.data.isNative) {
                        self.data.playerContext && self.data.playerContext.stop();
                    } else {
                        zgPlayer && zgPlayer.stop();
                    }
                    self.setData({
                        mainPusher: {
                            ...self.data.mainPusher,
                            ...{
                                streamID: '',
                                url: ''
                            }
                        },
                    });
                    playingList = playingList.filter(playItem => playItem.stream_id !== streamID);
                    if (self.data.isConnecting && self.data.isPublishing) {

                        // 停止推流
                        zg.stopPublishingStream(self.data.publishStreamID);

                        self.setData({
                            isPublishing: false,
                            isConnecting: false,
                            subPusher: {
                                ...self.data.subPusher,
                                ...{
                                    streamID: '',
                                    url: ''
                                }
                            }
                        }, function () {
                        });
                    }
                    isLogout = true;
                    logOutTer && clearTimeout(logOutTer);
                    console.log('isLogout', isLogout);
                    logOutTer = setTimeout(() => {
                        console.log('isLogout', isLogout);
                        if (isLogout) {
                            self.setData({
                                playStreamList: []
                            });
                            playingList = [];
                            zg.logout();
                            const content = {};
                            self.triggerEvent('RoomEvent', {
                                tag: 'onBack',
                                content
                            });
                        }
                    }, 10000);
                    break;

                } else {
                    let playStreamList = self.data.playStreamList;
                    for (let j = 0; j < playStreamList.length; j++) {
                        if (playStreamList[j]['streamID'] === streamID) {
                            console.log(
                                '>>>[liveroom-room] stopPlayingStream, stream to be deleted: '
                            );
                            console.log(playStreamList[j]);
                            playStreamList[j]['playUrl'] = '';
                            playStreamList.splice(j, 1);
                            break;
                        }
                    }
                    playingList = playingList.filter(item => item.stream_id !== streamID);

                    self.setData({
                            playStreamList
                        }, function () {
                            // 检查流删除后，是否低于房间流上限
                            if (
                                self.data.playStreamList.length <=
                                self.data.upperStreamLimit - 1
                            ) {
                                self.setData(
                                    {
                                        reachStreamLimit: false,
                                        isConnecting: false
                                    },
                                    function () {
                                        if (self.data.loginType === 'audience') {
                                            wx.showToast({
                                                title: '一位观众结束连麦，允许新的连麦',
                                                icon: 'none',
                                                duration: 2000
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    )
                }
            }
        },
        showMerchandise() {
            console.log('showMerchandise');
            let role = "anchor";
            const content = {
                role,
            }
            this.triggerEvent('RoomEvent', {
                tag: 'onMerchandise',
                // code: 0,
                content
            });
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
                id: 'M' + this.data.userID + Date.parse(new Date()),
                // name: this.data.userID,
                name: '我',
                color: "#FF4EB2",
                content: msgContent,
            };

            console.log('>>>[liveroom-room] currentMessage', msgContent);

            self.data.messageList.push(message);

            self.setData({
                messageList: self.data.messageList,
                scrollToView: message.id,
            });

            zg.sendBigRoomMessage(1, 1, message.content,
                function (seq, msgId, msg_category, msg_type, msg_content) {
                    console.log('>>>[liveroom-room] onComment success');
                },
                function (err, seq, msg_category, msg_type, msg_content) {
                    console.log('>>>[liveroom-room] onComment, error: ');
                    console.log(err);
                    wx.showModal({
                        title: '提示',
                        content: '发送消息失败',
                        showCancel: false,
                        success(res) {
                            // 用户点击确定，或点击安卓蒙层关闭
                            if (res.confirm || !res.cancel) {
                                // 强制用户退出

                            }
                        }
                    });
                });
            //   }else{
            //     wx.hideLoading();
            //     wx.showModal({
            //       title: '提醒',
            //       content: '请注意言论',
            //       showCancel:false
            //     })
            //   }
            // })

        },
        onNetworkStatus() {
            console.log('onNetworkStatus');
            wx.onNetworkStatusChange(res => {
                console.log('net', res);
                if (res.isConnected) {
                    networkOk = true;
                } else {
                    networkOk = false;
                }
            })
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
            this.data.playStreamList.forEach(item => {
                zg.stopPlayingStream(item.streamID);
            });
            this.data.isPublishing && zg.stopPublishingStream(this.data.publishStreamID);

            this.data.pusherContext && this.data.pusherContext.stop();
            this.data.playerContext && this.data.playerContext.stop();

            zgPusher && zgPusher.stop();
            zgPlayer && zgPlayer.stop();
            zg && zg.logout();

            this.setData({
                isPublishing: false,
                isConnecting: false,
                playStreamList: [],
                mainPusher: {},
                subPusher: {},
            });
            playingList = [];

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
            if (this.data.isNative) {
                zg && zg.updatePlayerNetStatus(e.target.id, e);
            } else {
                zg && zg.updatePlayerNetStatus(e.detail.streamID, e);
            }
        },
        onPushError: function (ev) {
            console.error(ev);
        }
    }
});

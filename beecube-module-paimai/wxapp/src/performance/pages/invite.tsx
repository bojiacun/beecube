import React, {Component} from "react";
import request from "../../lib/request";
import PageLayout from "../../layouts/PageLayout";
import {Button, Form, Input, Navigator, Picker, Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import PageLoading from "../../components/pageloading";
import moment from "moment";
import Taro from "@tarojs/taro";
import classNames from "classnames";


export default class Index extends Component<any, any> {
    state: any = {
        id: null,
        detail: null,
        invited: null,
        joinTime: null,
        saving: false,
        sending: false,
        counter: 60,
    }
    timer: any;
    mobileRef: any;
    constructor(props) {
        super(props);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleOnDateChange = this.handleOnDateChange.bind(this);
        this.handleSendCode = this.handleSendCode.bind(this);
        this.mobileRef = React.createRef();
    }
    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        let detail = this.state.detail;
        return {
            title: '您的朋友邀请您一起参加'+detail.title,
            query: {mid: mid, id: detail.id},
        }
    }
    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: '您的朋友邀请您一起参加'+this.state.detail.title,
            path: '/performance/pages/invite?id=' + this.state.detail.id + '&mid=' + mid
        }
    }
    handleOnDateChange(e) {
        this.setState({joinTime: e.detail.value});
    }
    async handleOnSubmit(e) {
        let data = e.detail.value;
        data.joinTime = this.state.joinTime;
        if(!data.userName) {
            utils.showError('请填写用户名');
            return
        }
        if(!data.phone) {
            utils.showError('请填写手机号');
            return
        }
        if(!data.joinTime) {
            utils.showError('请填写预计参展日期');
            return
        }
        data.joinTime = data.joinTime + ' 00:00:00';

        let values = {mobile: data.phone, code: data.code};

        let res = await request.put("/app/api/sms/check", values);
        if(!res.data.result) {
            utils.showMessage('验证码不正确').then();
            // return;
        }

        let checkResult = await request.get('/paimai/api/members/check');
        if (!checkResult.data.result) {
            return utils.showMessage("请完善您的个人信息(手机号、昵称、头像)后再出价", function () {
                Taro.navigateTo({url: '/pages/my/profile'}).then();
            });
        }
        this.setState({saving: true});
        request.post('/paimai/api/members/invites', data, {params: {id: this.state.detail.id}}).then(res=>{
            if(res.data.result){
                this.setState({saving: false});
                utils.showSuccess(false, '预约成功');
                setTimeout(()=>{
                    Taro.navigateTo({url: '/performance/pages/invited?id='+this.state.detail.id}).then();
                }, 1000);
            }
        }).catch(()=>this.setState({saving: false}));
    }
    handleSendCode() {
        if (!this.mobileRef.current?.value) {
            return utils.showMessage('请输入手机号');
        }
        this.setState({sending: true});
        request.post('/app/api/sms/send', {mobile: this.mobileRef.current.value}).then(() => {
            this.timer = setInterval(() => {
                this.setState((v) => {
                    v.counter--;
                    if (v.counter <= 0) {
                        clearInterval(this.timer);
                        v.counter = 60;
                        v.sending = false;
                    }
                    return v;
                })
            }, 1000);
        });
    }

    onLoad(options) {
        this.setState({id: options.id});
        request.get('/paimai/api/performances/detail', {params: {id: options.id}}).then(res => {
            let detail = res.data.result;
            this.setState({detail: detail});
            request.get('/paimai/api/members/invites', {params: {id: options.id}}).then(res => {
                this.setState({invited: res.data.result});
            })
        });
    }

    render() {
        const {detail, invited} = this.state;
        if (!detail) return <PageLoading/>;

        return (
            <PageLayout statusBarProps={{title: '预约报名'}}>
                <View className={'m-4 bg-white rounded-lg shadow-outer overflow-hidden'}>
                    <FallbackImage src={utils.resolveUrl(detail.preview)} mode={'widthFix'}
                                   className={'block w-full box-border'}/>
                    <View className={'p-4 space-y-4'}>
                        <View className={'text-lg font-bold'}>{detail.title}</View>
                        <View className={'space-x-4 text-sm text-gray-500'}>
                            <Text className={''}>拍卖地点</Text>
                            <Text>{detail.auctionAddress}</Text>
                        </View>
                        <View className={'space-x-4 text-gray-500 text-sm'}>
                            <Text className={''}>拍卖时间</Text>
                            <Text>{detail.auctionTimeRange || detail.startTime}</Text>
                        </View>
                        <View className={'border-t-1 pt-4 border-gray-200'}>
                            <Navigator className={'flex justify-between items-center'}
                                       url={'/performance/pages/detail' + (detail.type == 2 ? '2' : '') + '?id=' + detail.id}>
                                <View className={'title1'}>
                                    <Text>线上同步拍专场</Text>
                                </View>
                                <Text className={'font-bold iconfont icon-youjiantou_huaban text-red-600'}/>
                            </Navigator>
                        </View>
                    </View>
                </View>

                {invited == null &&
                    <Form onSubmit={this.handleOnSubmit}>
                        <View className={'m-4 p-4 bg-white rounded-lg shadow-outer overflow-hidden space-y-4'}>
                            <View className={'text-lg text-red-600 text-center font-bold'}>预约申请表</View>
                            <View className={'space-y-4'}>
                                <View className={'space-y-2'}>
                                    <View className={'text-gray-400'}>请输入您的姓名 <Text
                                        className={'text-red-600'}>*</Text></View>
                                    <View>
                                        <Input className={'p-4 bg-gray-200'} name={'userName'} adjustPosition={true} alwaysEmbed={true} cursorSpacing={24} />
                                    </View>
                                </View>
                                <View className={'space-y-2'}>
                                    <View className={'text-gray-400'}>请输入您的手机号 <Text
                                        className={'text-red-600'}>*</Text></View>
                                    <View>
                                        <Input className={'p-4 bg-gray-200'} name={'phone'} ref={this.mobileRef} adjustPosition={true} alwaysEmbed={true} cursorSpacing={24} />
                                    </View>
                                </View>
                                <View className={'space-y-2'}>
                                    <View className={'flex'}>
                                        <Input className={'p-4 bg-gray-200 flex-1'} name={'code'} adjustPosition={true} alwaysEmbed={true} cursorSpacing={24} />
                                        <Button className={classNames('flex items-center justify-center')} style={{color: 'black'}} onClick={this.handleSendCode}
                                                disabled={this.state.sending}>{this.state.sending ? this.state.counter + '' : '获取验证码'}</Button>
                                    </View>
                                </View>
                                <View className={'space-y-2'}>
                                    <View className={'text-gray-400'}>预计参展日期 <Text
                                        className={'text-red-600'}>*</Text></View>
                                    <view className="section">
                                        <Picker mode="date" value={this.state.joinTime} start={moment(new Date()).format('yyyy-MM-DD')} end={moment(new Date()).add(1, 'years').format('yyyy-MM-DD')}
                                                onChange={this.handleOnDateChange}>
                                            <View className="p-4 bg-gray-200">
                                                {this.state.joinTime?this.state.joinTime:'选择日期'}
                                            </View>
                                        </Picker>
                                    </view>
                                </View>
                                <View>
                                    <Button className={'btn btn-danger block w-full'} disabled={this.state.saving} formType={'submit'}>确认预约</Button>
                                </View>
                            </View>
                        </View>
                    </Form>
                }
                {invited != null &&
                    <View className={'m-4'}>
                        <Button className={'btn btn-info block w-full'} onClick={()=>Taro.navigateTo({url: `/performance/pages/invited?id=${detail.id}`}).then()}>您已预约成功，点击进入核销页面</Button>
                    </View>
                }
            </PageLayout>
        );
    }
}

import React, {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";
import {View, Picker, Input, Form, Button} from "@tarojs/components";
import LoginView from "../../components/login";
import {connect} from "react-redux";
import {setUserInfo} from "../../store/actions";
import request from "../../lib/request";

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
), (dispatch) => {
    return {
        updateUserInfo(userInfo) {
            dispatch(setUserInfo(userInfo));
        }
    }
})
export default class Index extends Component<any, any> {
    state:any = {
        id: '',
        address: null,
        region: ['','',''],
        saving: false,
    }
    addressRef:any = React.createRef();

    constructor(props: any) {
        super(props);
        this.handleRegionChange = this.handleRegionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.chooseAddress = this.chooseAddress.bind(this);
    }

    onLoad(options:any) {
        if(options && options.id) {
            this.setState({id: options.id});
            //加载地址信息
            request.get('/app/api/members/addresses/detail', {params: {id: options.id}}).then(res=>{
                let detail = res.data.result;
                this.setState({address: detail, region: [detail.province, detail.city, detail.district]});
            });
        }
    }

    chooseAddress() {
        Taro.chooseLocation({}).then(res=>{
            this.addressRef.current.value = res.address;
        })
    }


    handleSubmit(e) {
        this.setState({saving: true});
        let userInfo = this.props.context.userInfo;
        let values = e.detail.value;
        userInfo.nickname = values.nickname;
    }

    handleRegionChange(e) {
        const index = e.detail.value;
        let userInfo = this.props.context.userInfo;
        userInfo.sex = index + 1;
        this.props.updateUserInfo(userInfo);
    }

    render() {
        const {address} = this.state;

        return (
            <PageLayout statusBarProps={{title: (this.state.id == '' ? '新建':'编辑') + '收货地址'}}>
                <LoginView>
                    <Form onSubmit={this.handleSubmit}>
                        <View className={'bg-white divide-y divide-gray-100 text-gray-600'}>
                            <View className={'flex items-center justify-between p-4'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>收货人</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'username'}  value={address?.username} className={'text-right'}/>
                                </View>
                            </View>
                            <View className={'flex items-center justify-between p-4'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>联系电话</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'phone'} value={address?.phone} className={'text-right'}/>
                                </View>
                            </View>
                            <View className={'p-4'}>
                                <Picker mode={'region'} onChange={this.handleRegionChange} value={this.state.region}>
                                    <View className={'flex items-center justify-between'}>
                                        <View className={'flex items-center space-x-2'}>
                                            <View>地区选择</View>
                                        </View>
                                        <View className={'flex items-center space-x-2'}>
                                            <View>{this.state.region[0]} {this.state.region[1]} {this.state.region[2]}</View>
                                        </View>
                                    </View>
                                </Picker>
                            </View>
                            <View className={'flex items-center justify-between p-4'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>详细地址</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'address'} value={address?.address} className={'text-right'} ref={this.addressRef} />
                                    <View onClick={this.chooseAddress} className={'iconfont iconfont icon-youjiantou_huaban'}/>
                                </View>
                            </View>
                        </View>
                        <View className={'container mx-auto mt-4 text-center'}>
                            <Button className={'btn btn-primary w-56'} formType={'submit'} disabled={this.state.saving}>保存</Button>
                        </View>
                    </Form>
                </LoginView>
            </PageLayout>
        );
    }
}

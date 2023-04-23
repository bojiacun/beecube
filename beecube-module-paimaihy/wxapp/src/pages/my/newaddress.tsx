import React, {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";
import {View, Picker, Input, Form, Button, Switch} from "@tarojs/components";
import {connect} from "react-redux";
import {setUserInfo} from "../../store/actions";
import request from "../../lib/request";
import './newaddress.scss';
import utils from "../../lib/utils";

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
    state: any = {
        id: '',
        address: null,
        region: ['', '', ''],
        saving: false,
    }
    addressRef: any = React.createRef();
    usernameRef: any = React.createRef();
    phoneRef: any = React.createRef();
    isDefaultRef: any = React.createRef();

    constructor(props: any) {
        super(props);
        this.handleRegionChange = this.handleRegionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.chooseAddress = this.chooseAddress.bind(this);
    }

    onLoad(options: any) {
        if (options && options.id) {
            this.setState({id: options.id});
            //加载地址信息
            request.get('/app/api/members/addresses/detail', {params: {id: options.id}}).then(res => {
                let detail = res.data.result;
                this.usernameRef.current.value = detail.username;
                this.phoneRef.current.value = detail.phone;
                this.addressRef.current.value = detail.address;
                this.setState({address: detail, region: [detail.province, detail.city, detail.district]});
            });
        }
    }

    chooseAddress() {
        Taro.chooseLocation({}).then(res => {
            this.addressRef.current.value = res.address;
        })
    }


    handleSubmit(e) {
        this.setState({saving: true});
        let values = e.detail.value;
        values.province = this.state.region[0];
        values.city = this.state.region[1];
        values.district = this.state.region[2];
        values.isDefault = values.isDefault ? 1 : 0;
        if (this.state.address) {
            values.id = this.state.address.id;
            request.post('/app/api/members/addresses/edit', values).then((res) => {
                this.setState({saving: false});
                utils.showSuccess(true);
            });
        } else {
            request.post('/app/api/members/addresses/add', values).then((res) => {
                console.log(res);
                this.setState({saving: false});
                utils.showSuccess(true);
            });
        }
    }

    handleRegionChange(e) {
        this.setState({region: e.detail.value});
    }

    render() {

        return (
            <PageLayout statusBarProps={{title: (this.state.id == '' ? '新建' : '编辑') + '收货地址'}}>
                <Form onSubmit={this.handleSubmit}>
                    <View className={'bg-white divide-y divide-gray-100 text-gray-600'}>
                        <View className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>收货人</View>
                            </View>
                            <View className={'flex flex-1 items-center justify-end space-x-2'}>
                                <Input name={'username'} className={'text-right'} ref={this.usernameRef}/>
                            </View>
                        </View>
                        <View className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>联系电话</View>
                            </View>
                            <View className={'flex flex-1 justify-end items-center space-x-2'}>
                                <Input name={'phone'} className={'text-right'} ref={this.phoneRef}/>
                            </View>
                        </View>
                        <View className={'p-4'}>
                            <Picker mode={'region'} onChange={this.handleRegionChange} value={this.state.region}>
                                <View className={'flex items-center justify-between'}>
                                    <View className={'flex items-center space-x-2'}>
                                        <View>地区选择</View>
                                    </View>
                                    <View className={'flex flex-1 justify-end items-center space-x-2'}>
                                        <View>{this.state.region[0]} {this.state.region[1]} {this.state.region[2]}</View>
                                        <View className={'iconfont text-xl iconfont font-bold icon-youjiantou_huaban'}/>
                                    </View>
                                </View>
                            </Picker>
                        </View>
                        <View className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>详细地址</View>
                            </View>
                            <View className={'flex flex-1 items-center space-x-2 justify-end'}>
                                <Input name={'address'} className={'text-right'} ref={this.addressRef}/>
                                <View onClick={this.chooseAddress} className={'iconfont text-xl iconfont font-bold icon-dizhiguanli'}/>
                            </View>
                        </View>
                        <View className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>默认地址</View>
                            </View>
                            <View className={'flex flex-1 items-center space-x-2 justify-end'}>
                                <Switch name={'isDefault'} checked={this.state.address?.isDefault}/>
                            </View>
                        </View>
                    </View>
                    <View className={'container mx-auto mt-4 text-center'}>
                        <Button className={'btn btn-primary w-56'} formType={'submit'} disabled={this.state.saving}>保存</Button>
                    </View>
                </Form>
            </PageLayout>
        );
    }
}

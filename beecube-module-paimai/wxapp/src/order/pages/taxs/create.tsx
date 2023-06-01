import {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import {BaseEventOrig, FormProps, Navigator, Text, View} from "@tarojs/components";
import {Button, ConfigProvider, Form, Input, Radio} from '@taroify/core';
import Taro from "@tarojs/taro";
import request from "../../../lib/request";
import utils from "../../../lib/utils";


export default class Index extends Component<any, any> {
    state: any = {
        address: null,
    }

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }


    componentDidShow() {
        //获取用户默认地址, 优先读取本地存储的地址信息，没有则读取远程服务器信息
        const address = Taro.getStorageSync('ADDRESS');
        if (address) {
            this.setState({address: JSON.parse(address)});
        } else {
            request.get('/app/api/members/addresses/default', {params: {id: ''}}).then(res => {
                this.setState({address: res.data.result});
            })
        }
    }

    onSubmit(event: BaseEventOrig<FormProps.onSubmitEventDetail>) {
        const values = event.detail.value || {};
        values.orderIds = Taro.getStorageSync("TAX_ORDERS").join(',');
        values.address = this.state.address;
        if(!values.address) {
           return utils.showMessage('请选择收货地址');
        }
        request.post('/paimai/api/members/fapiao/create', values).then(res=>{
            Taro.removeStorageSync("TAX_ORDERS");
            utils.showSuccess(true, '申请成功');
        });
    }

    render() {
        const {address} = this.state;
        return (
            <PageLayout statusBarProps={{title: '申请开票'}} containerClassName={''}>
                <ConfigProvider theme={{radioSize: '14px'}}>
                    <Form controlAlign={'right'} onSubmit={this.onSubmit}>
                        <View className={'m-4 text-lg item-title font-bold'}>发票详情</View>
                        <View className={'bg-white rounded-lg mx-4'}>
                            <Form.Item name="type" defaultValue={'2'}>
                                <Form.Label>抬头类型</Form.Label>
                                <Form.Control>
                                    <Radio.Group direction="horizontal">
                                        <Radio name="2">企业单位</Radio>
                                        <Radio name="1">个人/非企业</Radio>
                                    </Radio.Group>
                                </Form.Control>
                            </Form.Item>
                            <Form.Item name="title" rules={[{required: true, message: "请填写发票抬头"}]}>
                                <Form.Label>发票抬头</Form.Label>
                                <Form.Control>
                                    <Input placeholder="填写发票抬头"/>
                                </Form.Control>
                            </Form.Item>
                            <Form.Item name="taxCode" rules={[{required: true, message: "请填写发票税号"}]}>
                                <Form.Label>税号</Form.Label>
                                <Form.Control>
                                    <Input placeholder="填写发票税号"/>
                                </Form.Control>
                            </Form.Item>
                            <Form.Item name="memberEmail">
                                <Form.Label>邮箱</Form.Label>
                                <Form.Control>
                                    <Input placeholder="填写邮箱"/>
                                </Form.Control>
                            </Form.Item>
                        </View>
                        <View className={'m-4 text-lg item-title font-bold'}>收件人信息（必填）</View>
                        <View className={'bg-white p-4 rounded-lg mx-4'}>
                            <Navigator url={'/pages/my/addresses'} className={'flex items-center justify-between'}>
                                <View className={'flex-1 space-y-2'}>
                                    <View className={'font-bold space-x-2'}>
                                        <Text className={'text-lg'}>{address?.username}</Text><Text>{address?.phone}</Text>
                                    </View>
                                    <View className={'text-gray-400'}>{address?.address}</View>
                                </View>
                                <View className={'px-2'}>
                                    <Text className={'fa fa-chevron-right'}/>
                                </View>
                            </Navigator>
                        </View>
                        <View className={'text-center text-stone-400 text-sm m-4'}>请确保您提交的信息无误，信息一旦提交将无法修改</View>

                        <View className={'p-4'}><Button variant={'contained'} color={'danger'} block shape={'round'} formType={'submit'}>确认提交</Button></View>
                    </Form>
                </ConfigProvider>
            </PageLayout>
        );
    }
}

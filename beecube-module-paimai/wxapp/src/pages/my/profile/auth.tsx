import React, {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import {Button, Form, Input, Text, View} from "@tarojs/components";
import {connect} from "react-redux";
import Taro from "@tarojs/taro";
import utils from "../../../lib/utils";
import request, {API_URL} from "../../../lib/request";
import {setUserInfo} from "../../../store/actions";
import FallbackImage from "../../../components/FallbackImage";

// @ts-ignore
@connect((state: any) => (
    {
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
    state = {
        saving: false,
        cardImages: ['', ''],
    }

    realnameInputRef = React.createRef();
    idCardInputRef = React.createRef();

    constructor(props: any) {
        super(props);
        this.chooseCardFace = this.chooseCardFace.bind(this);
        this.chooseCardBack = this.chooseCardBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let userInfo = JSON.parse(Taro.getStorageSync("EDIT-USER"));
        if(userInfo) {
            this.setState({cardImages: [userInfo.cardFace, userInfo.cardBack]});
        }
    }

    async chooseCardFace() {
        Taro.chooseImage({count: 1, sourceType: ['album', 'camera']}).then(async res => {
            const file = res.tempFilePaths[0];
            const res1 = await request.get('/app/api/members/tmptoken');
            const token = res1.data.result;
            //upload image
            utils.showLoading('上传中');
            Taro.uploadFile({
                url: API_URL + '/sys/oss/file/upload',
                name: 'file',
                filePath: file,
                header: {
                    "X-Access-Token": token,
                    "Authorization": token,
                    "Content-Type": 'application/json'
                }
            }).then((res: any) => {
                let result = JSON.parse(res.data);
                this.state.cardImages[0] = result.result.url;

                let userInfo = JSON.parse(Taro.getStorageSync("EDIT-USER"));
                // @ts-ignore
                userInfo.realname = this.realnameInputRef.current.value;
                // @ts-ignore
                userInfo.idCard = this.idCardInputRef.current.value;
                Taro.setStorageSync("EDIT-USER", JSON.stringify(userInfo));

                this.setState({cardImages: this.state.cardImages});
                utils.showSuccess(false, '上传成功');
            });
        });
    }

    async chooseCardBack() {
        Taro.chooseImage({count: 1, sourceType: ['album', 'camera']}).then(async res => {
            const file = res.tempFilePaths[0];
            const res1 = await request.get('/app/api/members/tmptoken');
            const token = res1.data.result;
            //upload image
            utils.showLoading('上传中');
            Taro.uploadFile({
                url: API_URL + '/sys/oss/file/upload',
                name: 'file',
                filePath: file,
                header: {
                    "X-Access-Token": token,
                    "Authorization": token,
                    "Content-Type": 'application/json'
                }
            }).then((res: any) => {
                let result = JSON.parse(res.data);
                this.state.cardImages[1] = result.result.url;
                let userInfo = JSON.parse(Taro.getStorageSync("EDIT-USER"));
                // @ts-ignore
                userInfo.realname = this.realnameInputRef.current.value;
                // @ts-ignore
                userInfo.idCard = this.idCardInputRef.current.value;
                Taro.setStorageSync("EDIT-USER", JSON.stringify(userInfo));
                this.setState({cardImages: this.state.cardImages});
                utils.showSuccess(false, '上传成功');
            });
        });
    }

    handleSubmit(e) {
        this.setState({saving: true});
        let values = e.detail.value;
        let userInfo = JSON.parse(Taro.getStorageSync("EDIT-USER"));
        userInfo.realname = values.realname;
        userInfo.idCard = values.idCard;
        userInfo.cardFace = this.state.cardImages[0];
        userInfo.cardBack = this.state.cardImages[1];
        Taro.setStorageSync("EDIT-USER",JSON.stringify(userInfo));
        Taro.navigateBack().then();
    }

    render() {
        let userInfo = JSON.parse(Taro.getStorageSync("EDIT-USER"));

        return (
            <PageLayout statusBarProps={{title: '实名认证'}}>
                <Form onSubmit={this.handleSubmit}>
                    <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                        <View className={'p-4 flex items-center justify-between'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>真实姓名</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <Input ref={this.realnameInputRef} name={'realname'} className={'text-right'} value={userInfo?.realname} />
                            </View>
                        </View>
                        <View className={'p-4 flex items-center justify-between'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>身份证号</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <Input ref={this.idCardInputRef} name={'idCard'} className={'text-right'} value={userInfo?.idCard} />
                            </View>
                        </View>
                    </View>
                    <View className={'grid grid-cols-2 gap-4 mt-4 px-4'}>
                        <View onClick={this.chooseCardFace}>
                            <View className={'flex relative flex-col items-center justify-center bg-gray-200 rounded-lg h-28'}>
                                {this.state.cardImages[0] && <FallbackImage mode={'aspectFit'} src={this.state.cardImages[0]} className={'block w-full h-full'}/>}
                                {!this.state.cardImages[0] && <View>身份证正面照</View>}
                                {!this.state.cardImages[0] && <View className={'text-lg text-red-600'}><Text className={'fa fa-plus'}/></View>}
                            </View>
                        </View>
                        <View onClick={this.chooseCardBack}>
                            <View className={'flex relative flex-col items-center justify-center bg-gray-200 rounded-lg h-28'}>
                                {this.state.cardImages[1] && <FallbackImage mode={'aspectFit'} src={this.state.cardImages[1]} className={'block w-full h-full'}/>}
                                {!this.state.cardImages[1] && <View>身份证反面照</View>}
                                {!this.state.cardImages[1] && <View className={'text-lg text-red-600'}><Text className={'fa fa-plus'}/></View>}
                            </View>
                        </View>
                    </View>
                    <View className={'container mx-auto mt-4 text-center'}>
                        <Button className={'btn btn-danger w-56'} formType={'submit'} disabled={this.state.saving}>确定</Button>
                    </View>
                </Form>
            </PageLayout>
        );
    }
}

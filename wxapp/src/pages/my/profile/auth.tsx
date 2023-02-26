import {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import LoginView from "../../../components/login";
import {Button, Form, Input, Text, View} from "@tarojs/components";
import {connect} from "react-redux";
import Taro from "@tarojs/taro";
import utils from "../../../lib/utils";
import {API_URL} from "../../../lib/request";
import {setUserInfo} from "../../../store/actions";
import {saveUserInfo} from "./services";
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
        cardImages: ['',''],
    }

    constructor(props:any) {
        super(props);
        this.chooseCardFace = this.chooseCardFace.bind(this);
        this.chooseCardBack = this.chooseCardBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    chooseCardFace() {
        Taro.chooseImage({count: 1, sourceType: ['album', 'camera']}).then(res => {
            const file = res.tempFilePaths[0];
            const token = Taro.getStorageSync("TOKEN");
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
                this.setState({cardImages: this.state.cardImages});
                utils.showSuccess(false, '上传成功');
            });
        });
    }
    chooseCardBack() {
        Taro.chooseImage({count: 1, sourceType: ['album', 'camera']}).then(res => {
            const file = res.tempFilePaths[0];
            const token = Taro.getStorageSync("TOKEN");
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
                this.setState({cardImages: this.state.cardImages});
                utils.showSuccess(false, '上传成功');
            });
        });
    }
    handleSubmit(e) {
        this.setState({saving: true});
        let values = e.detail.value;
        let userInfo = this.props.context.userInfo;
        userInfo.realname = values.realname;
        userInfo.idCard = values.idCard;
        userInfo.cardFace = this.state.cardImages[0];
        userInfo.cardBack = this.state.cardImages[1];
        saveUserInfo(userInfo).then(res=>{
            this.props.updateUserInfo(res.data.result);
            utils.showSuccess(true);
        });
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '实名认证'}}>
                <LoginView>
                    <Form onSubmit={this.handleSubmit}>
                        <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                            <View className={'p-4 flex items-center justify-between'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>真实姓名</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'realname'} className={'text-right'}/>
                                </View>
                            </View>
                            <View className={'p-4 flex items-center justify-between'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>身份证号</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'idCard'} className={'text-right'}/>
                                </View>
                            </View>
                        </View>
                        <View className={'grid grid-cols-2 gap-4 mt-4 px-4'}>
                            <View onClick={this.chooseCardFace}>
                                <View className={'flex flex-col items-center justify-center bg-gray-200 rounded-lg h-28'}>
                                    {this.state.cardImages[0] && <FallbackImage src={this.state.cardImages[0]} className={'block'} />}
                                    {!this.state.cardImages[0] && <View>身份证正面照</View>}
                                    {!this.state.cardImages[0] && <View className={'text-lg'}><Text className={'fa-plus'} /></View>}
                                </View>
                            </View>
                            <View onClick={this.chooseCardBack}>
                                <View className={'flex flex-col items-center justify-center bg-gray-200 rounded-lg h-28'}>
                                    {this.state.cardImages[1] && <FallbackImage src={this.state.cardImages[1]} className={'block'} />}
                                    {!this.state.cardImages[1] && <View>身份证反面照</View>}
                                    {!this.state.cardImages[1] && <View className={'text-lg'}><Text className={'fa-plus'} /></View>}
                                </View>
                            </View>
                        </View>
                        <View className={'container mx-auto mt-4 text-center'}>
                            <Button className={'btn-primary'} formType={'submit'} disabled={this.state.saving}>确定</Button>
                        </View>
                    </Form>
                </LoginView>
            </PageLayout>
        );
    }
}

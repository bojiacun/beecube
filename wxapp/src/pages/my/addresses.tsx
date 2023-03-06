import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import {connect} from "react-redux";
import PageLoading from "../../components/pageloading";
import {Button, View, Text} from "@tarojs/components";
import Taro from "@tarojs/taro";

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    state:any = {
        list: [],
    }

    componentDidShow() {
        request.get('/app/api/members/addresses').then(res=>{
            this.setState({list: res.data.result});
        });
    }

    selectAddress(item:any) {
        Taro.setStorageSync("ADDRESS", JSON.stringify(item));
        Taro.navigateBack().then();
    }

    handleRemove(id) {
        request.delete('/app/api/members/addresses/delete',{params: {id: id}}).then(()=>{
            request.get('/app/api/members/addresses').then(res=>{
                this.setState({list: res.data.result});
            });
        })
    }

    render() {
        const {systemInfo} = this.props;
        const {list} = this.state;
        if (list == null) return <PageLoading />;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '地址管理'}}>
                {list.map((item:any)=>{
                    return (
                        <View onClick={()=>this.selectAddress(item)} className={'flex shadow-outer items-center justify-between m-4 p-4 bg-white'}>
                            <View className={'flex-1 space-y-2'}>
                                <View className={'font-bold space-x-2'}>
                                    <Text className={'text-lg'}>{item.username}</Text><Text>{item.phone}</Text>
                                    {item.isDefault == 1 && <Text className={'text-red-500 font-bold text-sm border border-solid border-1 rounded p-1'}>默认</Text>}
                                </View>
                                <View className={'text-gray-400'}>{item.address}</View>
                            </View>
                            <View className={'px-2 text-2xl space-x-2 text-gray-400'}>
                                <Text onClick={(e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();
                                    Taro.navigateTo({url: 'newaddress?id='+item.id}).then();
                                }} className={'fa fa-pencil'} />
                                <Text onClick={(e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.handleRemove(item.id);
                                }} className={'fa fa-remove'} />
                            </View>
                        </View>
                    );
                })}

                <View className={'px-4 pt-1 flex items-center justify-center fixed bottom-0 w-full'} style={{paddingBottom: safeBottom}}>
                    <Button onClick={()=>Taro.navigateTo({url: 'newaddress'})} className={'btn btn-primary text-lg shadow-outer'}><Text className={'iconfont icon-plus'} />新建一个地址</Button>
                </View>
            </PageLayout>
        );
    }
}

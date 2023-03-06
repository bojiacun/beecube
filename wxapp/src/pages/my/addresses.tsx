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
                        <View className={'flex items-center justify-between m-4 p-4 bg-white'}>
                            <View className={'space-y-2'}>
                                <View className={'font-bold space-x-2'}><Text className={'text-lg'}>{item.username}</Text><Text>{item.phone}</Text></View>
                                <View className={'text-gray-400'}>{item.address}</View>
                            </View>
                            <View><Text onClick={()=>Taro.navigateTo({url: 'newaddress?id='+item.id})} className={'iconfont icon-edit'} /></View>
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

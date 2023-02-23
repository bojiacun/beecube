import { View,Text } from "@tarojs/components";
import Taro, {useDidShow} from "@tarojs/taro";
import {getUserReadRanksStatistics, getUserReadsStatistics} from "./service";
import {useEffect, useState} from "react";
import _ from 'lodash';
import withLogin from "../../../login/login";


const UserReadStatisticsModule = (props: any) => {
    const { index, style, basic, context, checkLogin,imageStyle, ...rest } = props;
    const {userInfo} = context;
    const [reads, setReads] = useState<any[]>([]);
    const [readTop, setReadTop] = useState<any>(0);

    const isLogin = checkLogin();

    const loadData = () => {
        if(!isLogin) return;
        getUserReadsStatistics().then(res => {
            setReads(res);
        });
        getUserReadRanksStatistics().then(res=>{
            if(!res || res.length == 0) {
                setReadTop(0);
            }
            else {
                res = _.sortBy(res, ['readCount']);
                let myId = userInfo.memberInfo.id;
                let index = _.findIndex(res, {memberId: myId});
                if(index < 0) {
                    setReadTop(0);
                }
                else {
                    // @ts-ignore
                    setReadTop(((index/res.length).toFixed(2))*100);
                }
            }
        });
    }

    useEffect(()=>loadData(), []);

    useDidShow(()=>{
        loadData();
    });

    if(!isLogin) {
        return <></>;
    }

    return (
        <View {...rest} style={style}>
            {basic.showTitle && <View style={{paddingLeft: '30rpx', borderBottom: '2rpx solid #f5f5f5', marginBottom: '10rpx'}}>
                <View className="text-lg margin-bottom-sm">{basic.title}</View>
            </View>}
            <View style={{paddingLeft: Taro.pxTransform(15), paddingRight: Taro.pxTransform(15)}}>
                <View className={'text-green'}>您的孩子阅读量击败了全国<Text className={'text-red text-bold'}>{readTop}%</Text>的孩子，请再接再厉</View>
                <View>
                    {reads.map((item:any)=>{
                        return (<View className={'flex margin-top align-center'}>
                            <Text style={{width: Taro.pxTransform(80)}}>{item.title}</Text>
                            <View className={'cu-progress round margin-left-sm'} style={{flex: 1}}>
                                <View className="bg-green" style={{width: item.percent+'%'}} />
                            </View>
                            <Text style={{width: Taro.pxTransform(40)}} className={'margin-left-sm'}>{item.percent}%</Text>
                        </View>);
                    })}
                </View>
            </View>
        </View>
    );
}

export default withLogin(UserReadStatisticsModule);

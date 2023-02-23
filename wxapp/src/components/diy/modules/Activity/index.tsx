import {Image, View, Text, Navigator} from "@tarojs/components";
import Taro, {useDidShow} from '@tarojs/taro';
import {useEffect, useState} from "react";
import withLogin from "../../../../components/login/login";
import {resolveUrl} from "../../../../utils/request";
import {getPagedActivities} from "./service";



const ActivityListModule = (props:any) => {
    const { index, style, basic, context, ...rest } = props;
    const {userInfo} = context;
    const [activities, setActivities] = useState<any[]>([]);

    const loadData = () => {
        getPagedActivities(userInfo?.memberInfo?.siteId??0).then(res=>{
            setActivities(res);
        })
    }

    useEffect(()=>{
        loadData();
    }, [userInfo?.memberInfo?.siteId]);

    useDidShow(()=>{
        loadData();
    });

    return (
        <View {...rest} style={style}>
            {basic.titleType == 1&&
                <View style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image src={'../../assets/images/designer/biaoqian.png'} mode="widthFix" style={{ display: 'block', width: '50%', position: 'absolute', zIndex: 0 }} />
                    <View className="text-lg" style={{ zIndex: 1, fontSize: basic.fontSize, marginBottom: '40rpx' }}>{basic.title}</View>
                </View>
            }
            {basic.titleType == 2 &&
                <View style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image mode='widthFix' src={resolveUrl(basic.titleimg)} style={{display: 'block', width: basic.titleimgWidth+'%', marginBottom: basic.titleBottomMargin, marginTop: basic.titleTopMargin}} />
                </View>
            }
            {
                activities.slice(0, basic.count).map((item: any, index: number) => {
                    return (
                        <View key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'white',
                            padding: '10px 15px',
                            marginBottom: index == activities.length - 1 ? 0 : Taro.pxTransform(basic.space),
                            borderRadius: Taro.pxTransform(basic.itemBorderRadius),
                            position: 'relative'
                        }}>
                            <View style={{width: Taro.pxTransform(80), marginRight: Taro.pxTransform(15)}}>
                                <Image src={resolveUrl(item.image)} style={{display: 'block', width: '100%', height: Taro.pxTransform(80), objectFit: 'cover'}}/>
                            </View>
                            <View style={{flex: 1}}>
                                <View className={'text-lg'} style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    marginBottom: 0,
                                    lineHeight: 2
                                }}>{item.name}</View>
                                <View style={{color: 'gray', fontSize: Taro.pxTransform(12), marginTop: Taro.pxTransform(3)}}>
                                    {item.description}
                                </View>
                                <View>参与费：<Text style={{color: '#ff5454', fontWeight: 'bold', fontSize: Taro.pxTransform(18)}}>{item.price}</Text> </View>
                            </View>
                            <Navigator url={`/activity/pages/detail?id=${item.id}`} style={{
                                backgroundColor: '#ffba16',
                                borderRadius: Taro.pxTransform(15),
                                position: 'absolute',
                                right: Taro.pxTransform(15),
                                bottom: Taro.pxTransform(15),
                                border: 'none',
                                padding: '5px 20px'
                            }}>参与活动
                            </Navigator>
                        </View>
                    );
                })
            }

        </View>
    );
}

export default withLogin(ActivityListModule);

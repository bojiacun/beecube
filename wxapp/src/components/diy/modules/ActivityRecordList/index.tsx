import {Image, View, Text, Video} from "@tarojs/components";
import Taro, {useDidShow} from '@tarojs/taro';
import {useEffect, useState} from "react";
import withLogin from "../../../../components/login/login";
import {resolveUrl} from "../../../../utils/request";
import {getPagedActivityRecords} from "./service";
import util from "../../../../utils/we7/util";



const ActivityRecordListModule = (props:any) => {
    const { index, style, basic, context, ...rest } = props;
    const {userInfo} = context;
    const [records, setRecords] = useState<any[]>([]);

    const loadData = () => {
        getPagedActivityRecords(userInfo?.memberInfo?.siteId??0).then(res=>{
            setRecords(res);
        })
    }

    useEffect(()=>{
        loadData();
    }, [userInfo?.memberInfo?.siteId]);

    useDidShow(()=>{
        loadData();
    });
    const openDetail = item => {
        if(item.activity.type == 2) {
            Taro.navigateTo({url: '/activity/pages/video?id='+item.id}).then();
        }
        else {
            //打开预览
            Taro.navigateTo({url: '/activity/pages/image?id='+item.id}).then();
        }
    }
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

            <View style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                {records.slice(0, basic.count).map((item: any) => {
                    let itemWidth = basic.space;
                    itemWidth = 'calc((100% - ' + util.px2rpx(itemWidth) + ') / 2)';
                    return (
                        <View onClick={() => openDetail(item)} key={item.id} style={{
                            width: itemWidth,
                            background: 'white',
                            marginBottom: basic.space,
                            borderRadius: util.px2rpx(basic.itemBorderRadius),
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <View style={{
                                paddingTop: '100%',
                                width: '100%',
                                position: 'relative',
                                borderRadius: util.px2rpx(basic.itemBorderRadius)
                            }}>
                                {item.activity.type == 1 &&
                                    <Image src={resolveUrl(item.attachment)} style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        display: 'block',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        zIndex: 99,
                                        borderRadius: util.px2rpx(basic.itemBorderRadius)
                                    }}/>
                                }
                                {item.activity.type == 2 &&
                                    <Video
                                        src={resolveUrl(item.attachment)}
                                        autoplay={false}
                                        muted={true}
                                        controls={false}
                                        initialTime={5}
                                        objectFit={'contain'}
                                        showPlayBtn={false}
                                        showCenterPlayBtn={false}
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            display: 'block',
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            zIndex: 99,
                                            borderRadius: util.px2rpx(basic.itemBorderRadius)
                                        }}
                                    />
                                }
                            </View>
                            <View className={'padding-left-sm padding-right-sm padding-bottom-sm'}>
                                <View className="text-lg text-black" style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    marginBottom: 0,
                                    lineHeight: 2
                                }}>{item.name}</View>
                            </View>
                            <View
                                className="padding-left-sm padding-right-sm padding-bottom-sm text-sm flex align-center justify-between">
                                <View className='flex align-center'>
                                    {item.memberAvatar && <View className='cu-avatar sm round margin-right-xs'
                                                                style={{backgroundImage: `url(${item.memberAvatar})`}}/>}
                                    <Text> {item.memberNickname} </Text>
                                </View>
                                <View><Text className='cuIcon-like margin-right-xs'/>{item.likes}</View>
                            </View>
                        </View>

                    );
                })}
            </View>

        </View>
    );
}

export default withLogin(ActivityRecordListModule);

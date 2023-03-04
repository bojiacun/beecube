import {Navigator, View, Text} from "@tarojs/components";
import {useEffect, useState} from "react";
import request from "../../../../lib/request";
import FallbackImage from "../../../FallbackImage";
import Taro from "@tarojs/taro";



const GoodsListModule = (props: any) => {
    const { index, basic, style, ...rest } = props;
    const layoutStyle = parseInt(basic.style);
    const dataSource = parseInt(basic.dataSource);
    const [goodsList, setGoodsList] = useState<any[]>([]);

    useEffect(()=>{
        request.get('/paimai/api/goods/list', {params: {type: 1, source: dataSource}}).then(res=>{
            setGoodsList(res.data.result.records);
        })
    }, [dataSource]);

    if(layoutStyle == 1) {
        return (
            <View style={style} className={'grid grid-cols-2 gap-4'} {...rest}>
                {goodsList.map((item:any)=>{
                    return (
                        <View className={'bg-white overflow-hidden'} style={{borderRadius: Taro.pxTransform(parseFloat(basic.itemBorderRadius))}}>
                            <Navigator url={'/pages/goods/detail?id='+item.id}>
                                <View className={'relative'} style={{width: '100%', paddingTop: '100%'}}>
                                    <FallbackImage mode={'aspectFit'} className={'absolute z-0 inset-0 block w-full h-full'} src={item.images.split(',')[0]}/>
                                </View>
                                <View className={'px-2 mt-2'}>{item.title}</View>
                                <View className={'px-2 mb-2 text-sm'}>
                                    起拍价 <Text className={'text-red-500'}>RMB</Text> <Text className={'text-red-500 text-base'}>{item.startPrice}</Text>
                                </View>
                            </Navigator>
                        </View>
                    );
                })}
            </View>
        );
    }
    else if(layoutStyle == 2) {
        return (
            <View className={'flex space-x-4 flex-nowrap'} style={{...style, overflowX: 'auto', overflowY: 'hidden'}} {...rest}>
                {goodsList.map((item:any)=>{
                    return (
                        <View style={{borderRadius: Taro.pxTransform(parseFloat(basic.itemBorderRadius))}}>
                            <Navigator url={'/pages/goods/detail?id='+item.id}>
                                <FallbackImage mode={'widthFix'} className={'rounded block w-full'} src={item.images.split(',')[0]}/>
                                <View className={'px-2 mt-2'}>{item.title}</View>
                                <View className={'px-2 mb-2'}>RMB {item.startPrice}</View>
                            </Navigator>
                        </View>
                    );
                })}
            </View>
        );
    }
    return <></>;
}

export default GoodsListModule;

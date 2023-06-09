import {View} from "@tarojs/components";
import {Popup} from "@taroify/core";
import utils from "../../../lib/utils";


const Uprange = (props:any) => {
    const {uprangeShow, onClose, goods} = props;

    return (
        <Popup open={uprangeShow} onClose={onClose} style={{width: '80%'}} rounded>
            <View className={'text-2xl'}>
                <View className={'flex py-4 items-center justify-center text-xl font-bold'}>加价幅度</View>
                <Popup.Close/>
            </View>
            <View className={'bg-indigo-200 text-gray-600 font-bold text-center flex py-2'}>
                <View className={'flex-1'}>竞价区间</View>
                <View className={'flex-1'}>加价幅度</View>
            </View>
            {goods.uprange.map(item=>{
                return (
                    <View className={'text-gray-600 text-center flex py-2'}>
                        <View className={'flex-1'}>{parseFloat(item.min)!=0?utils.numberFormat(item.min):'-'} ~ {parseFloat(item.max)!=0?utils.numberFormat(item.max):'-'}</View>
                        <View className={'flex-1'}>{item.price.split(',').map(price => utils.numberFormat(price)+',')}</View>
                    </View>
                );
            })}
        </Popup>
    );
}

export default Uprange;

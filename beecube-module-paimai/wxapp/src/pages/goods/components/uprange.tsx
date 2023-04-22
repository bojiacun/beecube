import Modal from "../../../components/modal";
import {View} from "@tarojs/components";
const numeral = require('numeral');


const Uprange = (props:any) => {
    const {uprangeShow, onClose, goods} = props;

    return (
        <Modal show={uprangeShow} showMask={true} onClose={onClose}>
            <View className={'bg-indigo-200 text-gray-600 font-bold text-center flex py-2'}>
                <View className={'flex-1'}>区间开始</View>
                <View className={'flex-1'}>区间结束</View>
                <View className={'flex-1'}>加价幅度</View>
            </View>
            {goods.uprange.map(item=>{
                return (
                    <View className={'text-gray-600 text-center flex py-2'}>
                        <View className={'flex-1'}>{parseFloat(item.min)!=0?numeral(item.min).format('0,0.00'):'-'}</View>
                        <View className={'flex-1'}>{parseFloat(item.max)!=0?numeral(item.max).format('0,0.00'):'-'}</View>
                        <View className={'flex-1'}>{numeral(item.price).format('0,0.00')}</View>
                    </View>
                );
            })}
        </Modal>
    );
}

export default Uprange;

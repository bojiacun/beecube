import {RichText, View} from "@tarojs/components";
import Collapse from "../../../components/collapse";
import utils from "../../../lib/utils";


const Descs = (props: any) => {
    const {goods} = props;
    return (
        <>
            <View className={'bg-white px-4 divide-y divide-gray-100'}>
                {goods.performanceType == 1? <Collapse showArrow={true} title={'拍卖专场'} description={goods.performanceTitle}
                                                 url={`/performance/pages/detail?id=${goods.performanceId}`}/> : <></>}
                {goods.performanceType == 2? <Collapse showArrow={true} title={'拍卖专场'} description={goods.performanceTitle}
                                                       url={`/performance/pages/detail2?id=${goods.performanceId}`}/> : <></>}
                {goods.performanceType == 1 ? <Collapse title={'结束时间'} description={goods.actualEndTime || goods.endTime}/>:<></>}
                {goods.fields.map(f => {
                    return <Collapse title={f.key} description={f.value}/>
                })}
            </View>
            <View className={'p-4'}>
                <View className={'font-bold'}>拍品描述</View>
                <View>
                    <RichText nodes={utils.resolveHtmlImageWidth(goods.description)}/>
                </View>
            </View>
            <View className={'bg-white px-4 divide-y divide-gray-100'}>
                <Collapse title={'拍卖流程'} showArrow={true}>
                    <RichText nodes={utils.resolveHtmlImageWidth(goods.descFlow)}/>
                </Collapse>
                <Collapse title={'物流运输'} showArrow={true}>
                    <RichText nodes={utils.resolveHtmlImageWidth(goods.descDelivery)}/>
                </Collapse>
                <Collapse title={'注意事项'} showArrow={true}>
                    <RichText nodes={utils.resolveHtmlImageWidth(goods.descNotice)}/>
                </Collapse>
                <Collapse title={'拍卖须知'} showArrow={true}>
                    <RichText nodes={utils.resolveHtmlImageWidth(goods.descRead)}/>
                </Collapse>
                <Collapse title={'保证金说明'} showArrow={true}>
                    <RichText nodes={utils.resolveHtmlImageWidth(goods.descDeposit)}/>
                </Collapse>
            </View>
        </>
    );
}

export default Descs;

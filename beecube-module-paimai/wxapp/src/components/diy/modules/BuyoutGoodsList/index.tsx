import {View, Text} from "@tarojs/components";
import {useEffect, useState} from "react";
import request from "../../../../lib/request";
import GoodsItemView from "./GoodsItemView";
import classNames from "classnames";


const BuyoutGoodsListModule = (props: any) => {
    const {index, basic, style, ...rest} = props;
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [classList, setClassList] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const loadData = (classIndex) => {
        request.get('/paimai/api/goods/list', {params: {type: 2, pageSize: basic.count, classId: classList[classIndex].id}}).then(res => {
            setGoodsList(res.data.result.records);
        });
    }

    useEffect(() => {
        if (classList.length > 0) {
            loadData(0);
        }
    }, [classList]);


    useEffect(() => {
        if (basic.showClass) {
            request.get('/paimai/api/goods/buyout/classes', {params: {}}).then(res => {
                setClassList([{id: '0', name: '推荐'},...res.data.result]);
            })
        }
    }, [basic.showClass]);

    return (
        <View style={style}>
            <View className={'py-4 -mx-4 flex items-center  flex-nowrap overflow-auto divide-x'}>
                {classList.map((item, index) => {
                    return (
                        <Text key={item.id} onClick={() => { setActiveIndex(index); loadData(index); }} className={classNames(index === activeIndex ? 'text-red-500 text-lg' : '', 'px-4 whitespace-nowrap')} >
                            {item.name}
                        </Text>
                    );
                })}
            </View>
            <View className={'grid grid-cols-2 gap-4'} {...rest}>
                {goodsList.map((item: any) => {
                    return (
                        <GoodsItemView item={item} radius={basic.itemBorderRadius}/>
                    );
                })}
            </View>
        </View>
    );

}

export default BuyoutGoodsListModule;

import {View} from "@tarojs/components";
import {useEffect, useState} from "react";
import request from "../../../../lib/request";
import GoodsItemView from "./GoodsItemView";


const GoodsListModule = (props: any) => {
    const {index, basic, style, ...rest} = props;
    const dataSource = parseInt(basic.dataSource);
    const [goodsList, setGoodsList] = useState<any[]>([]);

    useEffect(() => {
        request.get('/paimai/api/goods/list', {params: {type: 1, source: dataSource}}).then(res => {
            setGoodsList(res.data.result.records);
        })
    }, [dataSource]);

    return (
        <View style={style} className={'grid grid-cols-2 gap-4'} {...rest}>
            {goodsList.map((item: any) => {
                return (
                    <GoodsItemView item={item} radius={basic.itemBorderRadius}/>
                );
            })}
        </View>
    );

}

export default GoodsListModule;

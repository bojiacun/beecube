import { View } from "@tarojs/components";
import {useEffect, useState} from "react";
import request from "../../../../lib/request";
import AuctionGoodsItem from "../../../goods/AuctionGoodsItem";



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
                    return (<AuctionGoodsItem data={item} />);
                })}
            </View>
        );
    }
    else if(layoutStyle == 2) {
        return (
            <View {...rest} style={{...style}}>
                {goodsList.map((item:any)=>{
                    return (<AuctionGoodsItem data={item} />);
                })}
            </View>
        );
    }
    return <></>;
}

export default GoodsListModule;

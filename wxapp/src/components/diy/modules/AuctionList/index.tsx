import {View} from "@tarojs/components";
import {useEffect, useState} from "react";
import request from "../../../../lib/request";
import AuctionItemView from "./AuctionItemView";


const AuctionListModule = (props: any) => {
    const {index, basic, style, ...rest} = props;
    const dataSource = parseInt(basic.dataSource);
    const [goodsList, setGoodsList] = useState<any[]>([]);

    useEffect(() => {
        request.get('/paimai/api/auctions/list', {params: {source: dataSource, pageSize: basic.count}}).then(res => {
            setGoodsList(res.data.result.records);
        })
    }, []);

    return (
        <View style={style} className={'grid grid-cols-1 gap-4'} {...rest}>
            {goodsList.map((item: any) => {
                return (
                    <AuctionItemView item={item} radius={basic.itemBorderRadius}/>
                );
            })}
        </View>
    );

}

export default AuctionListModule;

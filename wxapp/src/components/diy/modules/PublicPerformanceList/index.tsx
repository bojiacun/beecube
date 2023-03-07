import {View} from "@tarojs/components";
import {useEffect, useState} from "react";
import request from "../../../../lib/request";
import PerformanceItemView from "./PerformanceItemView";


const PublicPerformanceListModule = (props: any) => {
    const {index, basic, style, ...rest} = props;
    const dataSource = parseInt(basic.dataSource);
    const [goodsList, setGoodsList] = useState<any[]>([]);

    useEffect(() => {
        request.get('/paimai/api/performances/list', {params: {tag: basic.tag, source: dataSource, pageSize: basic.count}}).then(res => {
            setGoodsList(res.data.result.records);
        })
    }, []);

    return (
        <View style={style} className={'grid grid-cols-1 gap-4'} {...rest}>
            {goodsList.map((item: any) => {
                return (
                    <PerformanceItemView item={item} radius={basic.itemBorderRadius}/>
                );
            })}
        </View>
    );

}

export default PublicPerformanceListModule;

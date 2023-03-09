import {View} from "@tarojs/components";
import {useEffect, useState} from "react";
import request from "../../../../lib/request";
import SyncPerformanceItemView from "../SyncPerformanceList/SyncPerformanceItemView";
import PerformanceItemView from "../PerformanceList/PerformanceItemView";
import {useSelector} from "react-redux";


const PublicPerformanceListModule = (props: any) => {
    const {index, basic, style, ...rest} = props;
    const dataSource = parseInt(basic.dataSource);
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const message = useSelector((state:any) => state.message);


    useEffect(()=>{
        if(message) {
            goodsList.forEach(g => {
                if(g.id == message.id) {
                    switch (message.type) {
                        case 'MSG_TYPE_PEFORMANCE_STARTED':
                            g.started = message.started;
                            break;
                        case 'MSG_TYPE_PEFORMANCE_ENDED':
                            g.ended = message.ended;
                            break;
                        case 'MSG_TYPE_PEFORMANCE_STARTTIME_CHANGED':
                            g.startTime = message.startTime;
                            break;
                    }
                }
            });
            setGoodsList([...goodsList]);
        }
    }, [message]);

    useEffect(() => {
        request.get('/paimai/api/performances/list', {params: {tag: basic.tag, source: dataSource, pageSize: basic.count}}).then(res => {
            setGoodsList(res.data.result.records);
        })
    }, []);

    return (
        <View style={style} className={'grid grid-cols-1 gap-4'} {...rest}>
            {goodsList.map((item: any) => {
                if(item.type == 2) {
                    return <SyncPerformanceItemView item={item} radius={basic.itemBorderRadius} />
                }
                return (
                    <PerformanceItemView item={item} radius={basic.itemBorderRadius}/>
                );
            })}
        </View>
    );

}

export default PublicPerformanceListModule;

import {View} from "@tarojs/components";
import {useEffect, useState} from "react";
import request from "../../../../lib/request";
import {useSelector} from "react-redux";
import LiveRoomItemView from "./LiveRoomItemView";


const LiveRoomListModule = (props: any) => {
    const {index, basic, style, ...rest} = props;
    const dataSource = parseInt(basic.dataSource);
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const message = useSelector((state:any) => state.message);


    useEffect(()=>{
        if(message) {
            goodsList.forEach(g => {
                if(g.id == message.performanceId) {
                    switch (message.type) {
                    }
                }
            });
            setGoodsList([...goodsList]);
        }
    }, [message]);

    useEffect(() => {
        request.get('/paimai/api/live/rooms', {params: {tag: basic.tag, source: dataSource, pageSize: basic.count}}).then(res => {
            setGoodsList(res.data.result.records);
        })
    }, []);

    return (
        <View style={style} className={'grid grid-cols-1 gap-4'} {...rest}>
            {goodsList.map((item: any) => {
                return (
                    <LiveRoomItemView item={item} radius={basic.itemBorderRadius}/>
                );
            })}
        </View>
    );

}

export default LiveRoomListModule;

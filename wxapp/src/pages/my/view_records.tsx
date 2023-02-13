import PageLayout from "../../layouts/PageLayout";
import {Navigator, Text, View} from "@tarojs/components";
import {useEffect, useState} from "react";
import localHistory from "../../utils/localHistory";


const ViewRecords = () => {
    const [viewRecords, setViewRecords] = useState<any[]>([]);

    useEffect(()=>{
        setViewRecords(localHistory.getViewRecords().reverse());
    }, []);

    return (
        <PageLayout statusBarProps={{title: '浏览记录'}}>
            <View className={'cu-list menu card-menu radius padding-top'}>
                {viewRecords.map((item:any)=>{
                    return (
                        <Navigator url={item.url} className={'cu-item'}>
                            <View className={'cu-content margin-top-sm margin-bottom-sm'}>
                                <View className={'text-lg margin-bottom-sm'}>{item.name}</View>
                                <View className={'text-gray'}>{item.site.name}</View>
                            </View>
                            <View className={'cu-action'}>
                                <Text className={'cuIcon-right'} />
                            </View>
                        </Navigator>
                    );
                })}
            </View>
        </PageLayout>
    );
}

export default ViewRecords;

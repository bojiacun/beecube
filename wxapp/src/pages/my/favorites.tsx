import PageLayout from "../../layouts/PageLayout";
import {Navigator, Text, View} from "@tarojs/components";
import {useEffect, useState} from "react";
import localHistory from "../../utils/localHistory";


const Favorites = () => {
    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(()=>{
        setFavorites(localHistory.getFavorites());
    }, []);
    return (
        <PageLayout statusBarProps={{title: '我的收藏'}}>
            <View className={'cu-list menu card-menu radius padding-top'}>
                {favorites.map((item:any)=>{
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

export default Favorites;

import { useEffect, useState } from "react";
import request, { API_ARTICLES, API_ARTICLE_CLASSES, resolveUrl, SERVICE_WINKT_SYSTEM_HEADER } from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import { View, Image, Text, ScrollView,Navigator } from "@tarojs/components";
import classNames from "classnames";
import withLogin from "../../components/login/login";


const HelpIndex = (props: any) => {
    const { headerHeight } = props;
    const [articleClasses, setArticleClasses] = useState<any[]>([]);
    const [articles, setArticles] = useState<any>([]);
    const [articleTabIndex, setArticleTabIndex] = useState<number>(0);
    useEffect(() => {
        request.get(API_ARTICLE_CLASSES, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
            setArticleClasses(res.data.data);
            res.data.data.forEach((cls, index: number) => {
                request.get(API_ARTICLES + '/' + cls.id, SERVICE_WINKT_SYSTEM_HEADER, { pageSize: 10000000 }, false).then(res2 => {
                    articles[index] = res2.data.data.content;
                    setArticles([...articles]);
                });
            });
        });
    }, []);
    return (
        <PageLayout statusBarProps={{ title: '帮助中心' }} style={{ minHeight: '100vh', backgroundColor: 'white' }}>
            <ScrollView scrollX={true}>
                <View className="flex text-sm align-center justify-around bg-white padding-bottom padding-left padding-right">
                    {
                        articleClasses.length > 0 && articleClasses.map((item: any, index) => {
                            return (
                                <>
                                    <View onClick={() => setArticleTabIndex(index)} className="flex flex-direction align-center" style={{ overflow: 'visible', position: 'relative' }}>
                                        <Image src={resolveUrl(item.image)} style={{ width: '60rpx' }} mode="widthFix" />
                                        <View className={classNames("margin-top-xs text-cut", articleTabIndex == index ? 'text-green' : '')}>{item.title}</View>
                                        {articleTabIndex == index && <Text className="cuIcon-triangledownfill text-sm text-green" style={{ position: 'absolute', bottom: -10 }} />}
                                    </View>
                                    {index < articleClasses.length - 1 && <Text className="cuIcon-playfill text-xs text-gray margin-bottom" />}
                                </>
                            );
                        })
                    }
                </View>
            </ScrollView>
            <View className="cu-list menu padding">
                {articles[articleTabIndex] && articles[articleTabIndex].map((item: any, index) => {
                    return (
                        <View style={{ padding: 0, minHeight: '0rpx', lineHeight: '72rpx' }} className="cu-item flex-wrap" onClick={() => {
                            item.showDescription = !item.showDescription;
                            setArticles([...articles]);
                        }}>
                            <View className="content">
                                {index + 1}. <Text>{item.title}</Text>
                            </View>
                            <View className="action">
                                <Text className={classNames(item.showDescription ? "cuIcon-triangleupfill" : "cuIcon-triangledownfill", "text-gray")} style={{ display: 'block', fontSize: '36rpx' }} />
                            </View>
                            {item.showDescription && <Navigator url={"detail?id="+item.id} className="text-gray padding-left" style={{ lineHeight: '48rpx', width: '100%' }}>{item.description}</Navigator>}
                        </View>
                    );
                })}
            </View>
        </PageLayout>
    );
}


export default withLogin(HelpIndex);
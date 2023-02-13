import { useEffect, useState } from "react";
import request, {API_ARTICLES_DETAIL, resolveUrl, SERVICE_WINKT_SYSTEM_HEADER} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {View, RichText, Video} from "@tarojs/components";
import withLogin from "../../components/login/login";
import Taro, {useRouter, useShareAppMessage, useShareTimeline} from "@tarojs/taro";
import moment from "moment";


const ArticleDetail = () => {
    const {params} = useRouter();
    const [info, setInfo] = useState<any>();
    useEffect(() => {
        if(params.id) {
            request.get(API_ARTICLES_DETAIL+'/'+params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>{
                let detail = res.data.data;
                detail.content = detail.content.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;" ');
                setInfo(detail);
            });
        }
    }, []);
    useShareAppMessage(() => {
        return {
            title: info.title,
            path: '/article/pages/detail?id=' + info.id,
        }
    });

    useShareTimeline(()=>{
        return {
            title: info.title,
        };
    });

    return (
        <PageLayout statusBarProps={{ title: '文章详情' }} style={{ minHeight: '100vh', backgroundColor: 'white' }}>
            {info?.image && <Video src={resolveUrl(info?.image)} style={{width: '100%', height: Taro.pxTransform(300)}} />}
            <View className="padding">
                <View className="text-xl text-black text-bold margin-bottom">{info?.title}</View>
                <View className="text-gray text-sm margin-bottom-sm">{moment(info?.createdAt).format('yyyy-MM-DD HH:mm:ss')}</View>
                <RichText nodes={info?.content} space={'nbsp'} />
            </View>
            <View style={{height: '140rpx'}} />
        </PageLayout>
    );
}


export default withLogin(ArticleDetail);

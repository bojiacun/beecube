import { useEffect, useState } from "react";
import request, { API_SITE_NOTICES_DETAIL, SERVICE_WINKT_SYSTEM_HEADER } from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import { View, RichText } from "@tarojs/components";
import withLogin from "../../components/login/login";
import { useRouter } from "@tarojs/taro";
import moment from "moment";


const HelpDetail = () => {
    const {params} = useRouter();
    const [info, setInfo] = useState<any>();
    useEffect(() => {
        if(params.id) {
            request.get(API_SITE_NOTICES_DETAIL+'/'+params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>{
                let detail = res.data.data;
                detail.content = detail.content.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;" ');
                setInfo(detail);
            });
        }
    }, []);
    return (
        <PageLayout statusBarProps={{ title: '公告详情' }} style={{ minHeight: '100vh', backgroundColor: 'white' }}>
            <View className="padding">
                <View className="text-xl text-black text-bold margin-bottom">{info?.title}</View>
                <View className="text-gray text-sm margin-bottom-sm">{moment(info?.createdAt).format('yyyy-MM-DD HH:mm:ss')}</View>
                <RichText nodes={info?.content} />
            </View>
            <View style={{height: '140rpx'}}></View>
        </PageLayout>
    );
}


export default withLogin(HelpDetail);
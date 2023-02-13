import {useState} from "react";
import Taro, {useRouter, useReady} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import {View, Textarea, Form, Button} from "@tarojs/components";
import Star from "../../components/star";
import request, {
    API_SHOP_GOODS_INFO,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import getValidator from "../../utils/validator";


const NewGrade = () => {
    const [goodsGrade, setGoodsGrade] = useState<number>(5);
    const [info, setInfo] = useState<any>(null);
    const [posting, setPosting] = useState<boolean>(false);
    const {params} = useRouter();

    useReady(()=>{
        loadData();
    })
    const loadData = () => {
        request.get(API_SHOP_GOODS_INFO+'/'+params.id, SERVICE_WINKT_SYSTEM_HEADER).then(res => {
            setInfo(res.data.data);
        })
    }
    const handleOrderGradeChange = (v) => {
        setGoodsGrade(v);
    }
    const postGrade = (e) => {
        const data = e.detail.value;
        data.shopGoods = {id:info.id};
        data.grade = goodsGrade;
        let validator = getValidator();
        //验证数据
        if(data.orderGrade <= 2) {
            validator.addRule(data, [
                {
                    name: 'reason',
                    strategy: 'isEmpty',
                    errmsg: '请填写评价内容'
                }
            ]);
        }
        const checked = validator.check();
        if (!checked.isOk) {
            setPosting(false);
            return Taro.showModal({ title: '错误提醒', content: checked.errmsg, showCancel: false });
        }
        setPosting(true);
        request.post("wxapp/shop/goods/grades", SERVICE_WINKT_SYSTEM_HEADER, data, true).then(()=>{
            setPosting(false);
            Taro.showToast({title: '评价成功!', icon: 'success'}).then(()=>{
                setTimeout(()=>{
                    Taro.navigateBack().then();
                }, 1000);
            });
        }).catch(()=>setPosting(false));
    }

    return (
        <PageLayout statusBarProps={{title: '评价商品'}}>
            <Form onSubmit={postGrade}>
                <View className="cu-card">
                    <View className="cu-item padding">
                        <View className="text-bold text-lg">
                            商品：{info?.name}
                        </View>
                        <View className="margin-top">
                            <Star title="商品评分" initValue={goodsGrade} onValueChange={handleOrderGradeChange}/>
                        </View>
                        {goodsGrade <=2 &&
                        <View className="margin-top flex align-start">
                            <View className="title" style={{width: '160rpx'}}>评价内容</View>
                            <Textarea name="reason" style={{padding: '10rpx'}} maxlength={-1} placeholder="评价内容"/>
                        </View>
                        }
                    </View>
                </View>

                <View className={"padding"}>
                    <Button formType="submit" disabled={posting} loading={posting} className="cu-btn bg-gradual-red shadow block xl no-radius">提交评价</Button>
                </View>
            </Form>
        </PageLayout>
    );
}

export default withLogin(NewGrade);

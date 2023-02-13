import {useRef, useState} from "react";
import {
    Button,
    Form,
    Input,
    Text, Textarea, TextareaProps,
    View
} from "@tarojs/components";
import Taro, {useReady, useRouter} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import getValidator from "../../utils/validator";
import request, {
    API_SUBSCRIBE_GOODS_INFO,
    SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import {InputProps} from "@tarojs/components/types/Input";


const NewSubscribeStock = (props) => {
    const {makeLogin} = props;
    const [posting, setPosting] = useState(false);
    const [info, setInfo] = useState<any>();
    const {params} = useRouter();

    const descriptionRef = useRef<TextareaProps>();
    const priceRef = useRef<InputProps>();

    useReady(() => {
        if (params.id) {
            request.get(API_SUBSCRIBE_GOODS_INFO+ "/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                let detail = res.data.data;
                setInfo(detail);
            });
        }
    })

    const onFinish = (e) => {
        let validator = getValidator();
        let data = {...e.detail.value};
        setPosting(true);
        //验证数据
        validator.addRule(data, [
            {
                name: 'description',
                strategy: 'isEmpty',
                errmsg: '请输入备注信息'
            },
            {
                name: 'count',
                strategy: 'isEmpty',
                errmsg: '请输入数量'
            },
        ]);


        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
            }

            request.post("wxapp/manager/subscribe/goods/stocks/"+info.id, SERVICE_WINKT_SYSTEM_HEADER, data, true).then(() => {
                setPosting(false);
                Taro.showToast({title: '调整成功', icon: 'success'}).then(() => {
                    setTimeout(() => {
                        Taro.navigateBack().then();
                    }, 1000);
                });
            }).catch(() => setPosting(false));
        })
    }

    // @ts-ignore
    return (
        <PageLayout statusBarProps={{title: `【${info?.shortName}】库存调整`}}>
            <Form onSubmit={onFinish}>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">库存调整</Text>
                        <Text className="bg-gradual-orange" style="width:3rem"/>
                    </View>
                </View>
                <View className="padding bg-white">
                    请谨慎调整商品库存
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>数量</View>
                    <Input name="count" placeholder="商品的变动数量支持负数" type='number' ref={priceRef}/>
                </View>
                <View className="cu-form-group">
                    <View className="title">调整原因</View>
                    <Textarea name='description' placeholder='输入本次调整的原因' ref={descriptionRef}/>
                </View>

                <View className="cu-form-group">
                    <View className="title">关联单号</View>
                    <Input name="ordersn" placeholder="关联的订单号，可不填" type='text' ref={priceRef}/>
                </View>
                <View style={{height: '200rpx'}}/>
                <View className={'cu-bar tabbar'} style={{width: '100%', position: 'fixed', bottom: 0, zIndex: 999}}>
                    <Button disabled={posting} loading={posting} formType="submit"
                            className="cu-btn block lg bg-orange no-radius" style={{width: '100%'}}>确定调整</Button>
                </View>
            </Form>
        </PageLayout>
    );
}

export default withLogin(NewSubscribeStock)

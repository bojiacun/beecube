import Taro, {useReady, useRouter} from "@tarojs/taro";
import PageLayout from "../../layouts/PageLayout";
import {
    Button,
    Form,
    View,
    RadioGroup,
    Radio, Label, Textarea, Text, Input, Navigator, Image
} from "@tarojs/components";
import {useEffect, useRef, useState} from "react";
import getValidator from "../../utils/validator";
import request, {
    resolveUrl,
    SERVICE_WINKT_ORDER_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import {InputProps} from "@tarojs/components/types/Input";
import moment from "moment";


const SubscribeServiceCheckPage = (props) => {
    const {makeLogin} = props;
    const [posting, setPosting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [info, setInfo] = useState<any>();
    const [resolveType, setResolveType] = useState<number>();
    const [lastOrder, setLastOrder] = useState<any>();
    const formRef = useRef();
    const countInputRef = useRef<InputProps>();
    const {params} = useRouter();


    useReady(() => {
        request.get("wxapp/manager/subscribe/after/orders/" + params.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
            setLastOrder(res.data.data);
            setLoading(false);
            setInfo(res.data.data.subscribeOrderGoods);
        });
    });
    useEffect(() => {
        if (countInputRef.current) {
            countInputRef.current!.value = '1';
        }
    }, [countInputRef.current, loading]);

    const onSubmit = (e) => {
        let data = {...e.detail.value, shopOrderGoods: {id: params.id}};
        let validator = getValidator();
        //验证数据
        validator.addRule(data, [
            {
                name: 'resolveType',
                strategy: 'isEmpty',
                errmsg: '请选择您要处理的方式'
            },
        ]);

        data.status = resolveType == 2 ? 0 : 2;

        setPosting(true);
        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
            }
            return request.put("wxapp/manager/subscribe/after/orders/" + lastOrder.id + "/confirm", SERVICE_WINKT_ORDER_HEADER, data, true).then((res) => {
                setPosting(false);
                setLastOrder(res.data.data);
                Taro.showToast({title: '处理成功', icon: 'success'}).then();
                setTimeout(() => {
                    Taro.navigateBack().then();
                }, 1000);
            }).catch(() => setPosting(false));
        })
    }

    const handleResolveTypeChanged = (e) => {
        setResolveType(parseInt(e.detail.value));
    }

    const previewImage = (urls: string[]) => {
        Taro.previewImage({urls: urls}).then();
    }
    const renderContent = () => {
        if (lastOrder && lastOrder.status == 1) {
            return (
                <Form onSubmit={onSubmit} ref={formRef}>
                    <Navigator url={`subscribe_order_detail?id=${lastOrder.subscribeOrderGoods.subscribeOrder.id}`}
                               className="cu-form-group">
                        <View className="title">用户订单</View>
                        <View>
                            {lastOrder.subscribeOrderGoods.subscribeOrder.ordersn} <Text className='cuIcon-right'/>
                        </View>
                    </Navigator>
                    <View className="cu-form-group">
                        <View className="title">申请类型</View>
                        <RadioGroup name={'type'} className={'flex align-center'}>
                            <Label className={'margin-right'}>
                                <Radio value={'1'} checked={true} disabled={true}
                                       className={'margin-right-xs orange'}/> 损坏
                            </Label>
                        </RadioGroup>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">数量</View>
                        <Input name='count' type="number" disabled={true} placeholder="输入申请售后的商品数量"
                               value='1'
                               style={{textAlign: 'right'}}/>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">备注</View>
                        <Textarea name="description" placeholder="备注信息" disabled={true} value={lastOrder.description}/>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">损坏照片</View>
                        <View className='margin-sm' style={{width: '100%'}}>
                            <Image onClick={() => previewImage([resolveUrl(lastOrder.photo)])}
                                   src={resolveUrl(lastOrder.photo)} style={{width: '100%'}} mode={'widthFix'}/>
                        </View>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">处理方式</View>
                        <RadioGroup name={'resolveType'} onChange={handleResolveTypeChanged}
                                    className={'flex align-center'}>
                            <Label className={'margin-right'}>
                                <Radio value={'1'} checked={resolveType == 1}
                                       className={'margin-right-xs orange'}/> 审核通过
                            </Label>
                            <Label className={'margin-right'}>
                                <Radio value={'2'} checked={resolveType == 2} className={'margin-right-xs orange'}/> 拒绝
                            </Label>
                        </RadioGroup>
                    </View>
                    <Button disabled={posting} loading={posting} formType='submit'
                            className="cu-btn block lg bg-orange shadow"
                            style={{margin: '25rpx'}}>确认审核</Button>
                </Form>
            );
        } else if (lastOrder && lastOrder.status == 0) {
            return (
                <Form onSubmit={onSubmit} ref={formRef}>
                    <Navigator url={`subscribe_order_detail?id=${lastOrder.subscribeOrderGoods.subscribeOrder.id}`}
                               className="cu-form-group">
                        <View className="title">用户订单</View>
                        <View>
                            {lastOrder.subscribeOrderGoods.subscribeOrder.ordersn} <Text className='cuIcon-right'/>
                        </View>
                    </Navigator>
                    <View className="cu-form-group">
                        <View className="title">申请类型</View>
                        <RadioGroup name={'type'} className={'flex align-center'}>
                            <Label className={'margin-right'}>
                                <Radio value={'1'} checked={true} disabled={true}
                                       className={'margin-right-xs orange'}/> 损坏
                            </Label>
                        </RadioGroup>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">数量</View>
                        <Input name='count' type="number" disabled={true} placeholder="输入申请售后的商品数量"
                               value='1'
                               style={{textAlign: 'right'}}/>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">备注</View>
                        <Textarea name="description" placeholder="备注信息" disabled={true} value={lastOrder.description}/>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">损坏照片</View>
                        <View className='margin-sm' style={{width: '100%'}}>
                            <Image onClick={() => previewImage([resolveUrl(lastOrder.photo)])}
                                   src={resolveUrl(lastOrder.photo)} style={{width: '100%'}} mode={'widthFix'}/>
                        </View>
                    </View>
                    <View
                        className='padding bg-white margin-top-sm'>该售后申请已于{moment(lastOrder?.resolvedAt).format('yyyy-MM-DD HH:mm:ss')}被拒绝</View>
                </Form>
            );
        } else if (lastOrder && lastOrder.status == 2) {
            return (
                <Form onSubmit={onSubmit} ref={formRef}>
                    <Navigator url={`subscribe_order_detail?id=${lastOrder.subscribeOrderGoods.subscribeOrder.id}`}
                               className="cu-form-group">
                        <View className="title">用户订单</View>
                        <View>
                            {lastOrder.subscribeOrderGoods.subscribeOrder.ordersn} <Text className='cuIcon-right'/>
                        </View>
                    </Navigator>
                    <View className="cu-form-group">
                        <View className="title">申请类型</View>
                        <RadioGroup name={'type'} className={'flex align-center'}>
                            <Label className={'margin-right'}>
                                <Radio value={'1'} checked={true} disabled={true}
                                       className={'margin-right-xs orange'}/> 损坏
                            </Label>
                        </RadioGroup>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">数量</View>
                        <Input name='count' type="number" disabled={true} placeholder="输入申请售后的商品数量"
                               value='1'
                               style={{textAlign: 'right'}}/>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">备注</View>
                        <Textarea name="description" placeholder="备注信息" disabled={true} value={lastOrder.description}/>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">损坏照片</View>
                        <View className='margin-sm' style={{width: '100%'}}>
                            <Image onClick={() => previewImage([resolveUrl(lastOrder.photo)])}
                                   src={resolveUrl(lastOrder.photo)} style={{width: '100%'}} mode={'widthFix'}/>
                        </View>
                    </View>
                    <View className='padding bg-white margin-top-sm'>该售后申请已于{moment(lastOrder?.resolvedAt).format('yyyy-MM-DD HH:mm:ss')}审核通过</View>
                </Form>
            );
        }
    }

    return (
        <PageLayout statusBarProps={{title: '售后详情'}} loading={loading}>
            <View className="bg-white margin-bottom" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">商品信息</Text>
                    </View>
                </View>
                {info &&
                    <View className="cu-list menu-avatar">
                        <View className="cu-item">
                            <View className="cu-avatar radius lg"
                                  style={{backgroundImage: 'url(' + resolveUrl(info.images.split(',')[0]) + ')'}}/>
                            <View className="content">
                                <View className="text-black text-cut">{info.name}</View>
                                <View className="text-red">￥{info.price}</View>
                            </View>
                            <View className="action" style={{width: '180rpx'}}>
                                <View className="text-gray">
                                    X {info.count}
                                </View>
                            </View>
                        </View>
                    </View>
                }
            </View>
            {renderContent()}
            <View style={{height: Taro.pxTransform(80)}}/>
        </PageLayout>
    );
}


export default withLogin(SubscribeServiceCheckPage)

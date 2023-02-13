import Taro, {useReady, useRouter} from "@tarojs/taro";
import PageLayout from "../../layouts/PageLayout";
import {
    Button,
    Form,
    View,
    RadioGroup,
    Radio, Label, Textarea, Text, Input
} from "@tarojs/components";
import {useEffect, useRef, useState} from "react";
import getValidator from "../../utils/validator";
import request, {
    resolveUrl,
    SERVICE_WINKT_ORDER_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import {InputProps} from "@tarojs/components/types/Input";


const NewService = (props) => {
    const {makeLogin} = props;
    const [posting, setPosting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [info, setInfo] = useState<any>();
    const [lastOrder, setLastOrder] = useState<any>();
    const formRef = useRef();
    const countInputRef = useRef<InputProps>();
    const {params} = useRouter();


    useReady(() => {
        request.get("wxapp/shop/orders/goods/" + params.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
            setInfo(res.data.data);
            return request.get("wxapp/shop/after/orders/" + params.id, SERVICE_WINKT_ORDER_HEADER, null, true);
        }).then(res => {
            setLastOrder(res.data.data);
            setLoading(false);
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
                name: 'type',
                strategy: 'isEmpty',
                errmsg: '请选择退换货类型'
            },
            {
                name: 'count',
                strategy: 'isEmpty',
                errmsg: '请输入要申请售后的商品数量'
            },
        ]);
        if (parseInt(data.count) > info.count) {
            return Taro.showModal({title: '错误提醒', content: '商品数量不正确', showCancel: false});
        }
        setPosting(true);
        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
            }
            return request.post("wxapp/shop/after/orders", SERVICE_WINKT_ORDER_HEADER, data, true).then(() => {
                setPosting(false);
                Taro.showToast({title: '申请成功', icon: 'success'}).then();
                setTimeout(() => {
                    Taro.navigateBack().then();
                }, 1000);
            }).catch(() => setPosting(false));
        })
    }

    const renderContent = () => {
        if (lastOrder && lastOrder.status == 1) {
            return (
                <Form>
                    <View className="cu-form-group">
                        <View className="title">申请类型</View>
                        <RadioGroup name={'type'} className={'flex align-center'}>
                            <Label className={'margin-right'}>
                                <Radio value={'1'} checked={lastOrder.type == 1} disabled={true}
                                       className={'margin-right-xs orange'}/> 退款
                            </Label>
                            <Label className={'margin-right'}>
                                <Radio value={'2'} checked={lastOrder.type == 2} disabled={true}
                                       className={'margin-right-xs orange'}/> 退货
                            </Label>
                            <Label className={''}>
                                <Radio value={'3'} checked={lastOrder.type == 3} disabled={true}
                                       className={'margin-right-xs orange'}/> 换货
                            </Label>
                        </RadioGroup>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">数量</View>
                        <Input name='count' type="number" disabled={true} placeholder="输入申请售后的商品数量"
                               value={lastOrder.count}
                               style={{textAlign: 'right'}}/>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">备注</View>
                        <Textarea name="description" placeholder="备注信息" disabled={true}
                                  value={lastOrder.description}></Textarea>
                    </View>
                    <Button disabled={true} className="cu-btn block lg bg-orange shadow"
                            style={{margin: '25rpx'}}>审核中...</Button>
                </Form>
            );
        }
        else if(lastOrder && lastOrder.status == 2) {
            return (
                <View className='padding bg-white'>您的售后申请已处理完毕</View>
            );
        }
        else {
            return (
                <>
                    {lastOrder && lastOrder.status == 0 &&
                        <View
                            className={'bg-white margin-bottom padding text-gray'}>您上一次的申请已被拒绝，拒绝原因为:{lastOrder.denyNote}</View>
                    }
                    <Form onSubmit={onSubmit} ref={formRef}>
                        <View className="cu-form-group">
                            <View className="title">申请类型</View>
                            <RadioGroup name={'type'} className={'flex align-center'}>
                                <Label className={'margin-right'}>
                                    <Radio value={'1'} className={'margin-right-xs orange'}/> 退款
                                </Label>
                                <Label className={'margin-right'}>
                                    <Radio value={'2'} className={'margin-right-xs orange'}/> 退货
                                </Label>
                                <Label className={''}>
                                    <Radio value={'3'} className={'margin-right-xs orange'}/> 换货
                                </Label>
                            </RadioGroup>
                        </View>
                        <View className="cu-form-group">
                            <View className="title">数量</View>
                            <Input name='count' type="number" placeholder="输入申请售后的商品数量" ref={countInputRef}
                                   style={{textAlign: 'right'}}/>
                        </View>
                        <View className="cu-form-group">
                            <View className="title">备注</View>
                            <Textarea name="description" placeholder="备注信息"/>
                        </View>
                        <Button disabled={posting} loading={posting} formType="submit"
                                className="cu-btn block lg bg-orange shadow" style={{margin: '25rpx'}}>提交申请</Button>
                    </Form>
                </>
            );
        }
    }

    return (
        <PageLayout statusBarProps={{title: '申请售后'}} loading={loading}>
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
        </PageLayout>
    );
}


export default withLogin(NewService)

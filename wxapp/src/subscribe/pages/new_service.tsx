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
    API_UPLOADFILE,
    resolveUrl, SERVICE_WINKT_COMMON_HEADER,
    SERVICE_WINKT_ORDER_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import {InputProps} from "@tarojs/components/types/Input";
import util from "../../utils/we7/util";


const NewService = (props) => {
    const {makeLogin} = props;
    const [posting, setPosting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [info, setInfo] = useState<any>();
    const [pictures, setPictures] = useState<any>([]);
    const [type, setType] = useState<number>(0);
    const [lastOrder, setLastOrder] = useState<any>();
    const formRef = useRef();
    const countInputRef = useRef<InputProps>();
    const {params} = useRouter();


    useReady(() => {
        request.get("wxapp/subscribe/orders/goods/" + params.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
            setInfo(res.data.data);
            return request.get("wxapp/subscribe/after/orders/" + params.id, SERVICE_WINKT_ORDER_HEADER, null, true);
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

    const chooseImage = (index) => {
        Taro.chooseImage({
            count: 1, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
        }).then(res => {
            pictures[index] = res.tempFilePaths[0];
            Taro.showLoading({title: '正在上传文件'});
            return Taro.uploadFile({
                url: util.url(API_UPLOADFILE),
                filePath: pictures[index],
                name: 'file',
                header: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Requested-Service': SERVICE_WINKT_COMMON_HEADER,
                    'Authorization': 'Bearer ' + util.getToken()
                },
                formData: {'chunks': 1, 'chunk': 0, name: pictures[index], 'type': 1}
            }).then((res: any) => {
                let data = JSON.parse(res.data);
                pictures[index] = data.data;
                setPictures([...pictures]);
                Taro.hideLoading();
            })
        }).catch((err) => {
            Taro.hideLoading();
            console.log(err);
        })
    }
    const onSubmit = (e) => {
        let data = {...e.detail.value, subscribeOrderGoods: {id: params.id}};

        if(pictures.length > 0) {
            data.photo = pictures[0];
        }
        let validator = getValidator();
        //验证数据
        validator.addRule(data, [
            {
                name: 'type',
                strategy: 'isEmpty',
                errmsg: '请选择损坏类型'
            },
            {
                name: 'count',
                strategy: 'isEmpty',
                errmsg: '请输入要申请售后的商品数量'
            },

        ]);

        if(data.type == 1) {
            validator.addRule(data, [
                {
                    name: 'photo',
                    strategy: 'isEmpty',
                    errmsg: '请上传损坏照片'
                },
            ]);
        }

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
            if(data.type == 1) {
                //损坏单提交售后，需要审核
                return request.post("wxapp/subscribe/after/orders", SERVICE_WINKT_ORDER_HEADER, data, true).then(() => {
                    setPosting(false);
                    if (data.type == 1) {
                        Taro.showToast({title: '申请成功', icon: 'success'}).then();
                        setTimeout(() => {
                            Taro.navigateBack().then();
                        }, 1000);
                    }
                }).catch(() => setPosting(false));
            }
            else if(data.type == 2) {
                //如果是丢失单，则直接支付订单
                return request.put("wxapp/subscribe/orders/createloss", SERVICE_WINKT_ORDER_HEADER, data, true).then((res) => {
                    let result = res.data.data;
                    setPosting(false);
                    //需要微信支付
                    result.pay.package = result.pay.packageValue;
                    Taro.requestPayment(result.pay).then(() => {
                        //支付已经完成，提醒支付成功并返回上一页面
                        Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
                            setTimeout(() => {
                                Taro.navigateBack().then()
                            }, 2000);
                        });
                    });
                }).catch(() => setPosting(false));
            }
        })
    }

    const startPay = () => {
        setPosting(true);
        request.put("wxapp/subscribe/after/orders/" + lastOrder.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
            let result = res.data.data;
            setPosting(false);
            //需要微信支付
            result.pay.package = result.pay.packageValue;
            Taro.requestPayment(result.pay).then(() => {
                //支付已经完成，提醒支付成功并返回上一页面
                Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
                    setTimeout(() => {
                        Taro.navigateBack().then()
                    }, 2000);
                });
            })
        })
    }

    const handleTypeChanged = (e) => {
        let type = e.detail.value;
        setType(type);
    }

    const renderContent = () => {
        if (lastOrder && lastOrder.type == 1 && lastOrder.status == 1) {
            return (
                <Form onSubmit={onSubmit} ref={formRef}>
                    <View className="cu-form-group">
                        <View className="title">损坏或丢失</View>
                        <RadioGroup name={'type'} className={'flex align-center'}>
                            <Label className={'margin-right'}>
                                <Radio value={'1'} disabled={true} checked={lastOrder.type == 1}
                                       className={'margin-right-xs orange'}/> 损坏
                            </Label>
                            <Label className={'margin-right'}>
                                <Radio value={'2'} disabled={true} checked={lastOrder.type == 2}
                                       className={'margin-right-xs orange'}/> 丢失
                            </Label>
                        </RadioGroup>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">数量</View>
                        <Input name='count' type="number" value={lastOrder.count} disabled={true}
                               placeholder="输入申请售后的商品数量"
                               style={{textAlign: 'right'}}/>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">备注</View>
                        <Textarea name="description" placeholder="备注信息" disabled={true} value={lastOrder.description}/>
                    </View>
                    <Button disabled={true} loading={posting} className="cu-btn block lg bg-orange shadow"
                            style={{margin: '25rpx'}}>
                        损坏审核中...
                    </Button>
                </Form>
            );
        } else if (lastOrder && lastOrder.type == 1 && lastOrder.status == 3) {
            return (
                <Form onSubmit={onSubmit} ref={formRef}>
                    <View className="cu-form-group">
                        <View className="title">损坏或丢失</View>
                        <RadioGroup name={'type'} className={'flex align-center'}>
                            <Label className={'margin-right'}>
                                <Radio value={'1'} disabled={true} checked={lastOrder.type == 1}
                                       className={'margin-right-xs orange'}/> 损坏
                            </Label>
                            <Label className={'margin-right'}>
                                <Radio value={'2'} disabled={true} checked={lastOrder.type == 2}
                                       className={'margin-right-xs orange'}/> 丢失
                            </Label>
                        </RadioGroup>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">数量</View>
                        <Input name='count' type="number" value={lastOrder.count} disabled={true}
                               placeholder="输入申请售后的商品数量"
                               style={{textAlign: 'right'}}/>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">备注</View>
                        <Textarea name="description" placeholder="备注信息" disabled={true} value={lastOrder.description}/>
                    </View>
                    <Button disabled={posting} loading={posting} onClick={startPay}
                            className="cu-btn block lg bg-red"
                            style={{margin: '25rpx'}}>补缴{lastOrder.payed}元损坏费</Button>
                </Form>
            );
        } else if(lastOrder && lastOrder.status == 4) {
            return (
                <View className='padding bg-white'>您的售后申请已处理完毕</View>
            );
        } else {
            return (
                <Form onSubmit={onSubmit} ref={formRef}>
                    <View className="cu-form-group">
                        <View className="title">损坏或丢失</View>
                        <RadioGroup name={'type'} className={'flex align-center'} onChange={handleTypeChanged}>
                            <Label className={'margin-right'}>
                                <Radio value={'1'} checked={type == 1} className={'margin-right-xs orange'}/> 损坏
                            </Label>
                            <Label className={'margin-right'}>
                                <Radio value={'2'} checked={type == 2} className={'margin-right-xs orange'}/> 丢失
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
                    {type == 1 &&
                        <View className="cu-form-group">
                            <View className="title">图片上传</View>
                            <View onClick={() => chooseImage(0)}
                                  style={{
                                      height: '360rpx',
                                      width: '100%',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'center center',
                                      backgroundSize: 'cover',
                                      backgroundImage: pictures[0] ? 'url(' + resolveUrl(pictures[0]) + ')' : 'none'
                                  }}
                                  className="bg-gray margin-sm padding radius-lg flex align-center justify-center flex-direction"
                            >
                                {
                                    !pictures[0] &&
                                    <> <Text className="cuIcon-add" style={{fontSize: 48, color: '#aaa'}}/>
                                        <View>上传损坏照片</View></>
                                }
                            </View>
                        </View>
                    }
                    <Button disabled={loading} loading={posting} formType='submit'
                            className="cu-btn block lg bg-orange shadow"
                            style={{margin: '25rpx'}}>
                        {type == 1 ? '提交审核':'支付损失费'}
                    </Button>
                </Form>
            );
        }
    }

    return (
        <PageLayout statusBarProps={{title: '图书损坏或丢失'}} loading={loading}>
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

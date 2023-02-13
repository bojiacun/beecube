import {useRef, useState} from "react";
import {
    Button,
    Form,
    Input, Label,
     Radio, RadioGroup,
    Switch,
    Text,
    View
} from "@tarojs/components";
import Taro, {useDidShow, useReady, useRouter} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import getValidator from "../../utils/validator";
import request, {
    API_SHOP_GOODS_INFO,
    SERVICE_WINKT_LIVE_HEADER, SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import {InputProps} from "@tarojs/components/types/Input";


const EditLiveGoodsPage = (props) => {
    const {makeLogin} = props;
    const [posting, setPosting] = useState(false);
    const [info, setInfo] = useState<any>();
    const [goodsInfo, setGoodsInfo] = useState<any>();
    const [goods, setGoods] = useState<any>();
    const [isSecKill, setIsSecKill] = useState<boolean>();
    const {params} = useRouter();

    const secKillPriceRef = useRef<InputProps>();
    const secKillMaxCountRef = useRef<InputProps>();
    const secKillTimeRef = useRef<InputProps>();


    useReady(() => {
        if(params.id) {
            request.get("wxapp/manager/live/histories/" + params.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                let detail = res.data.data;
                setInfo(detail);
            });
        }
        if(params.goods_id) {
            request.get("wxapp/manager/live/histories/goods/" + params.goods_id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                let detail = res.data.data;
                setGoodsInfo(detail);
                setIsSecKill(detail.isSecKill);
                if(detail.isSecKill) {
                    secKillMaxCountRef.current!.value = detail.secKillMaxCount;
                    secKillPriceRef.current!.value = detail.secKillPrice;
                    secKillTimeRef.current!.value = detail.secKillTime;
                }
                return request.get(API_SHOP_GOODS_INFO+"/"+detail.goodsId, SERVICE_WINKT_SYSTEM_HEADER, null,false);
            }).then(res=>{
                setGoods(res.data.data);
            });
        }
    });

    useDidShow(() => {
        let item = Taro.getStorageSync("tmp_live_goods");
        if(item) {
            setGoods(item);
            Taro.removeStorageSync("tmp_live_goods");
        }
    });


    const onFinish = (e) => {
        let validator = getValidator();
        let data = {...e.detail.value};

        if(goods) {
            data.goodsId = goods.id;
            data.goodsName = goods.name;
            data.goodsImage = goods.images.split(',')[0];
        }
        data.roomHistory = info;
        data.room = info.room;

        setPosting(true);
        //验证数据
        validator.addRule(data, [
            {
                name: 'goodsId',
                strategy: 'isEmpty',
                errmsg: '请选择商品'
            },
        ]);
        if (isSecKill) {
            validator.addRule(data, [
                {
                    name: 'secKillPrice',
                    strategy: 'isEmpty',
                    errmsg: '必须填写秒杀价格'
                },
                {
                    name: 'secKillMaxCount',
                    strategy: 'isEmpty',
                    errmsg: '必须填写秒杀最大数量'
                },
                {
                    name: 'secKillTime',
                    strategy: 'isEmpty',
                    errmsg: '必须填写秒杀时长'
                },
            ]);
        }

        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
            }

            if (!goodsInfo) {
                return request.post("wxapp/manager/live/histories/goods", SERVICE_WINKT_LIVE_HEADER, data, true).then(() => {
                    setPosting(false);
                    Taro.showToast({title: '保存成功', icon: 'success'}).then(() => {
                        setTimeout(() => {
                            Taro.navigateBack().then();
                        }, 1000);
                    });
                }).catch(() => setPosting(false));
            } else {
                return request.put("wxapp/manager/live/histories/goods/"+goodsInfo.id, SERVICE_WINKT_LIVE_HEADER, data, true).then(() => {
                    setPosting(false);
                    Taro.showToast({title: '更新成功', icon: 'success'}).then(() => {
                        setTimeout(() => {
                            Taro.navigateBack().then();
                        }, 1000);
                    });
                }).catch(() => setPosting(false));
            }
        })
    }

    const jumpSelectGoodsList = () => {
        if(info.goodsType == 1) {
            Taro.navigateTo({url: `goods_list?action=select`}).then();
        }
        else {
            Taro.navigateTo({url: `subscribe_goods_list?action=select`}).then();
        }
    }

    // @ts-ignore
    return (
        <PageLayout statusBarProps={{title: goodsInfo ? '编辑直播商品' : '新建直播商品'}}>
            <Form onSubmit={onFinish}>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">基本信息</Text>
                        <Text className="bg-gradual-orange" style="width:3rem"/>
                    </View>
                </View>
                <View className="cu-form-group">
                    <View className="title">商品来源</View>
                    <RadioGroup name={'goodsType'} className={'flex align-center'}>
                        <Label className={'margin-right'}>
                            <Radio value={'1'} disabled={true} checked={info?.goodsType == 1} className={'margin-right-xs orange'}/> 商城图书
                            <Radio value={'2'} disabled={true} checked={!info?.goodsType || info?.goodsType == 2} className={'margin-right-xs orange'}/> 借阅图书
                        </Label>
                    </RadioGroup>
                </View>
                <View className="cu-form-group" onClick={jumpSelectGoodsList}>
                    <View className="title"><Text className={'text-red'}>*</Text>关联商品</View>
                    <Input name="goodsId" placeholder="选择要关联的直播商品" disabled={true} value={goods?.shortName} />
                    <Text className={'cuIcon-right'}/>
                </View>
                {
                    !info?.room.siteId &&
                    <View className="cu-form-group">
                        <View className="title">秒杀活动</View>
                        <Switch name='isSecKill' className='orange' checked={isSecKill}
                                onChange={(v) => setIsSecKill(v.detail.value)}/>
                    </View>
                }

                {isSecKill &&
                    <>
                        <View className="cu-form-group">
                            <View className="title"><Text className={'text-red'}>*</Text>秒杀价</View>
                            <Input name="secKillPrice" placeholder="商品的秒杀价格" type='digit' ref={secKillPriceRef} />
                        </View>
                        <View className="cu-form-group">
                            <View className="title"><Text className={'text-red'}>*</Text>秒杀数量</View>
                            <Input name="secKillMaxCount" placeholder="秒杀商品的最大数量" type={'number'} ref={secKillMaxCountRef} />
                        </View>
                        <View className="cu-form-group">
                            <View className="title"><Text className={'text-red'}>*</Text>秒杀时长</View>
                            <Input name="secKillTime" placeholder="秒杀持续时间，多少秒" type={'number'} ref={secKillTimeRef} />
                        </View>
                    </>
                }

                <View style={{height: '200rpx'}}/>
                <View className={'cu-bar tabbar'} style={{width: '100%', position: 'fixed', bottom: 0, zIndex: 999}}>
                    <Button disabled={posting} loading={posting} formType="submit"
                            className="cu-btn block lg bg-orange no-radius" style={{width: '100%'}}>保存</Button>
                </View>
            </Form>
        </PageLayout>
    );
}

export default withLogin(EditLiveGoodsPage)

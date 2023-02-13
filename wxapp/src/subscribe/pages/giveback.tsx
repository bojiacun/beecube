import Taro, {useReady, useRouter} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {Button, Form, Image, Input, Label, Radio, RadioGroup, RichText, View} from "@tarojs/components";
import {useRef, useState} from "react";
import request, {
    API_SITES_INFO,
    API_SUBSCRIBE_GOODS_ORDERS,
    SERVICE_WINKT_ORDER_HEADER, SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
// @ts-ignore
import styles from './index.module.scss';
import withLogin from "../../components/login/login";


const GivebackPage = (props) => {
    const {checkLogin, makeLogin} = props;
    const [info, setInfo] = useState<any>();
    const [qrcode, setQrcode] = useState<any>();
    const [siteInfo, setSiteInfo] = useState<any>();
    const [type, setType] = useState<number>(1);
    const [posting, setPosting] = useState(false);
    const formRef = useRef();
    const isLogined = checkLogin();
    const {params} = useRouter();

    const loadData = () => {
        if (isLogined && params.id) {
            request.get(API_SUBSCRIBE_GOODS_ORDERS + "/" + params.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
                setInfo(res.data.data);
                request.get(API_SITES_INFO+"/"+res.data.data.siteId, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>{
                    let detail = res.data.data;
                    detail.givebackNotice = detail.givebackNotice.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;" ');
                    setSiteInfo(detail);
                })
            });
            request.get("wxapp/subscribe/orders/qrcode/"+params.id, SERVICE_WINKT_ORDER_HEADER, null, true, 'arraybuffer').then(res => {
                setQrcode(Taro.arrayBufferToBase64(res.data));
            });
        }
    }
    useReady(() => {
        loadData();
    });
    const onFinish = (e) => {
        const data = e.detail.value;
        setPosting(true);
        request.put("wxapp/subscribe/orders/"+info?.id+"/giveback", SERVICE_WINKT_ORDER_HEADER, data, true).then(() => {
            setPosting(false);
            Taro.showToast({title: '归还成功，等待审核', icon: 'success'}).then();
            setTimeout(()=>{
                Taro.redirectTo({url: 'giveback_success'}).then();
            }, 1000);
        }).catch(() => setPosting(false));
    }

    const onTypeChanged = (e) => {
        setType(parseInt(e.detail.value));
    }
    return (
        <PageLayout showTabBar={false} statusBarProps={{title: '归还图书'}}>
            <View className="cu-card no-card article margin-top-sm">
                <View className="cu-item">
                    <View className="title">归还说明</View>
                    <View className="content">
                        <RichText nodes={siteInfo?.givebackNotice} space={'nbsp'} />
                    </View>
                </View>
                <View className="cu-item">
                    <View className="title">归还门店</View>
                    <View className="content">
                        {siteInfo?.name} {siteInfo?.address} {siteInfo?.contact}
                    </View>
                </View>
                <View className={'cu-item'}>
                    <View className={'title'}>归还方式</View>
                </View>
            </View>
            <Form onSubmit={onFinish} ref={formRef}>
                <View className="cu-form-group">
                    <RadioGroup name={'refundType'} onChange={onTypeChanged} className={'flex align-center'}>
                        <Label className={'margin-right'}>
                            <Radio value={'1'} checked={type === 1} className={'margin-right-xs orange'}/> 快递配送
                        </Label>
                        <Label className={''}>
                            <Radio value={'2'} checked={type === 2} className={'margin-right-xs orange'}/> 扫码归还
                        </Label>
                        <Label className={''}>
                            <Radio value={'3'} checked={type === 3} className={'margin-right-xs orange'}/> 学生归还
                        </Label>
                    </RadioGroup>
                </View>
                {type == 1 &&
                    <View className="margin-top-sm">
                        <View className="cu-form-group">
                            <View className="title text-bold">快递单号</View>
                            <Input type="text" name={'refundDeliveryNumber'} placeholder="归还图书的快递单号" style={{textAlign: 'right'}}/>
                        </View>
                    </View>
                }
                {type == 2 &&
                    <View className="margin-top-sm">
                        {qrcode && <Image src={'data:image/png;base64,'+qrcode} mode="widthFix" style={{width: '100%'}} />}
                    </View>
                }
                {isLogined && (type == 1 || type == 3) && <Button loading={posting} disabled={posting} formType="submit"
                                                   className="cu-btn block margin lg bg-orange">确认提交</Button>}
                {isLogined && type == 2 &&
                    <View className='text-gray margin-sm text-center'>上门归还，请店员扫码核销</View>
                }
                {!isLogined &&
                    <Button onClick={() => makeLogin()} className="cu-btn block lg margin bg-green">点击登录</Button>}

            </Form>

            <View style={{height: '128rpx'}} />
        </PageLayout>
    );
}

export default withLogin(GivebackPage)

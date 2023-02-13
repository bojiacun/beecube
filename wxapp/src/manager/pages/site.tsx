import {useRef, useState} from "react";
import {
    Button,
    Form,
    Input,
    Switch, SwitchProps,
    Text, Textarea, TextareaProps,
    View
} from "@tarojs/components";
import Taro, {useReady} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import getValidator from "../../utils/validator";
import request, {
    SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import {InputProps} from "@tarojs/components/types/Input";


const SiteInfoPage = (props) => {
    const {makeLogin} = props;
    const [posting, setPosting] = useState(false);
    const [info, setInfo] = useState<any>();
    const businessHoursRef = useRef<InputProps>();
    const borrowNoticeRef = useRef<TextareaProps>();
    const givebackNoticeRef = useRef<TextareaProps>();
    const subscribeCountRef = useRef<InputProps>();
    const subscribeDaysRef = useRef<InputProps>();
    const lateFeeRef = useRef<InputProps>();
    const enableSelfPickUpRef = useRef<SwitchProps>();
    const enableDeliveryRef = useRef<SwitchProps>();

    useReady(() => {
        request.get("/wxapp/manager/sites/my", SERVICE_WINKT_SYSTEM_HEADER, null, true).then(res => {
            let detail = res.data.data;
            businessHoursRef.current!.value = detail.businessHours;
            borrowNoticeRef.current!.value = detail.borrowNotice;
            givebackNoticeRef.current!.value = detail.givebackNotice;
            subscribeCountRef.current!.value = detail.subscribeCount;
            subscribeDaysRef.current!.value = detail.subscribeDays;
            lateFeeRef.current!.value = detail.lateFee;
            enableSelfPickUpRef.current!.checked = detail.enableSelfPickUp;
            enableDeliveryRef.current!.checked = detail.enableDelivery;
            setInfo(detail);
        });
    })


    const onFinish = (e) => {
        let validator = getValidator();
        let data = {...e.detail.value};
        setPosting(true);
        //验证数据
        validator.addRule(data, [
            {
                name: 'businessHours',
                strategy: 'isEmpty',
                errmsg: '请输入营业时间'
            },
            {
                name: 'borrowNotice',
                strategy: 'isEmpty',
                errmsg: '请输入借阅须知'
            },
            {
                name: 'givebackNotice',
                strategy: 'isEmpty',
                errmsg: '请输入归还须知'
            },
            {
                name: 'subscribeCount',
                strategy: 'isEmpty',
                errmsg: '请输入借阅数量'
            },
            {
                name: 'subscribeDays',
                strategy: 'isEmpty',
                errmsg: '请输入借阅天数'
            },
            {
                name: 'lateFee',
                strategy: 'isEmpty',
                errmsg: '请输入滞纳金'
            },
        ]);

        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
            }

            request.put("wxapp/manager/sites/my", SERVICE_WINKT_SYSTEM_HEADER, data, true).then(() => {
                setPosting(false);
                Taro.showToast({title: '保存成功', icon: 'success'}).then(() => {
                    setTimeout(() => {
                        Taro.navigateBack().then();
                    }, 1000);
                });
            }).catch(() => setPosting(false));
        })
    }

    // @ts-ignore
    return (
        <PageLayout statusBarProps={{title: '编辑门店信息'}}>
            <Form onSubmit={onFinish}>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">基本信息</Text>
                        <Text className="bg-gradual-orange" style="width:3rem"/>
                    </View>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>营业时间</View>
                    <Input name="businessHours" placeholder="门店营业时间" ref={businessHoursRef}/>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>借阅须知</View>
                    <Textarea name='borrowNotice' placeholder='门店借阅须知，用户购买会员时显示' ref={borrowNoticeRef}/>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>归还须知</View>
                    <Textarea name='givebackNotice' placeholder='门店归还时的说明提示' ref={givebackNoticeRef}/>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>借阅时长</View>
                    <Input name="subscribeDays" placeholder="一次借阅的市场（天）" type={'number'} ref={subscribeDaysRef}/>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>借阅数量</View>
                    <Input name="subscribeCount" placeholder="一次借阅的数量（本）" type={'number'} ref={subscribeCountRef}/>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>滞纳金</View>
                    <Input name="lateFee" placeholder="归还超时，每本每天多少滞纳金" type={'digit'} ref={lateFeeRef}/>
                </View>
                <View className="cu-form-group">
                    <View className="title">到店自提</View>
                    <Switch name='enableSelfPickUp' className='orange' checked={enableSelfPickUpRef.current?.checked}
                            ref={enableSelfPickUpRef}/>
                </View>
                <View className="cu-form-group">
                    <View className="title">快递配送</View>
                    <Switch name='enableDelivery' className='orange' checked={enableDeliveryRef.current?.checked}
                            ref={enableDeliveryRef}/>
                </View>

                <View style={{height: '200rpx'}}/>
                <View className={'cu-bar tabbar'} style={{width: '100%', position: 'fixed', bottom: 0, zIndex: 999}}>
                    <Button disabled={!info || posting} loading={posting} formType="submit"
                            className="cu-btn block lg bg-orange no-radius" style={{width: '100%'}}>保存</Button>
                </View>
            </Form>
        </PageLayout>
    );
}

export default withLogin(SiteInfoPage)

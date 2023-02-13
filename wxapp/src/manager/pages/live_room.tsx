import { useRef, useState } from "react";
import {
    Button,
    Form,
    Input,
    Text,
    View
} from "@tarojs/components";
import Taro, {useReady} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import getValidator from "../../utils/validator";
import request, {
    SERVICE_WINKT_LIVE_HEADER,
} from "../../utils/request";
import {InputProps} from "@tarojs/components/types/Input";


const LiveRoomPage = (props) => {
    const {makeLogin} = props;
    const [posting, setPosting] = useState(false);
    const [info, setInfo] = useState<any>();

    const nameRef = useRef<InputProps>();
    const groupIdRef = useRef<InputProps>();


    useReady(() => {
        request.get( "wxapp/manager/live/myroom", SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
            let detail = res.data.data;
            if(detail) {
                setInfo(detail);
                nameRef.current!.value = detail.name;
                groupIdRef.current!.value = detail.groupId;
            }
        });
    })

    const onFinish = (e) => {
        let validator = getValidator();
        let data = { ...e.detail.value };
        setPosting(true);
        //验证数据
        validator.addRule(data, [
            {
                name: 'name',
                strategy: 'isEmpty',
                errmsg: '直播间名称不能为空'
            },
        ]);

        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({ title: '错误提醒', content: checked.errmsg, showCancel: false });
            }

            if(!info) {
                return request.post("wxapp/manager/live/rooms", SERVICE_WINKT_LIVE_HEADER, data, true).then(() => {
                    setPosting(false);
                    Taro.showToast({title: '申请成功', icon: 'success'}).then(() => {
                        setTimeout(() => {
                            Taro.navigateBack().then();
                        }, 1000);
                    });
                }).catch(() => setPosting(false));
            }
            else {
                return request.put("wxapp/manager/live/rooms/"+info.id, SERVICE_WINKT_LIVE_HEADER, data, true).then(() => {
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

    // @ts-ignore
    return (
        <PageLayout statusBarProps={{title: '我的直播间'}}>
            <Form onSubmit={onFinish}>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">基本信息</Text>
                        <Text className="bg-gradual-orange" style="width:3rem" />
                    </View>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>直播间名称</View>
                    <Input name="name" placeholder="直播间名称" disabled={info} ref={nameRef} />
                </View>
                {info &&
                    <View className="cu-form-group">
                        <View className="title"><Text className={'text-red'}>*</Text>聊天室ID</View>
                        <Input name="groupId" disabled={true} placeholder="腾讯云聊天室ID" ref={groupIdRef} />
                    </View>
                }
                <View style={{height: '200rpx'}} />
                {!info &&
                    <View className={'cu-bar tabbar'}
                          style={{width: '100%', position: 'fixed', bottom: 0, zIndex: 999}}>
                        <Button disabled={posting} loading={posting} formType="submit"
                                className="cu-btn block lg bg-orange no-radius" style={{width: '100%'}}>申请开通直播间</Button>
                    </View>
                }
                {info && !info.status &&
                    <View className={'cu-bar tabbar'}
                          style={{width: '100%', position: 'fixed', bottom: 0, zIndex: 999}}>
                        <Button disabled={true} loading={posting} className="cu-btn block lg bg-orange no-radius" style={{width: '100%'}}>直播间审核中</Button>
                    </View>
                }
                {info && info.status &&
                    <View className={'cu-bar tabbar'}
                          style={{width: '100%', position: 'fixed', bottom: 0, zIndex: 999}}>
                        <Button disabled={true} loading={posting} className="cu-btn block lg bg-green no-radius" style={{width: '100%'}}>直播间审核通过</Button>
                    </View>
                }
            </Form>
        </PageLayout>
    );
}

export default withLogin(LiveRoomPage)

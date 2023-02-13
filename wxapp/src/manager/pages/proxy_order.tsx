import { Form, View, Text, Input, Picker, Button } from "@tarojs/components";
import Taro from '@tarojs/taro';
import { useRef, useState } from "react";
import withLogin from "../../components/login/login";
import getValidator from "../../utils/validator";
import PageLayout from "../../layouts/PageLayout";
import request, { API_RECYCLERS_INFO, API_RECYCLERS_PROXY_ORDER, API_SITES, SERVICE_WINKT_RECYCLER_HEADER, SERVICE_WINKT_SYSTEM_HEADER } from "../../utils/request";
import { useDidShow } from "@tarojs/taro";



const ProxyOrder = (props) => {
    const [communities, setCommunities] = useState<any>([]);
    const [selectedCommunity, setSelectedCommunity] = useState(-1);
    const [posting, setPosting] = useState(false);
    const { makeLogin} = props;
    const addressRef = useRef();
    useDidShow(() => {
        //获取回收员信息，同时更新当前位置
        Taro.getLocation({isHighAccuracy: true, type: 'gcj02'}).then(pos=>{
            request.put(API_RECYCLERS_INFO, SERVICE_WINKT_RECYCLER_HEADER, {lat: pos.latitude, lng: pos.longitude}, true).then(res=>{
                let info = res.data.data;
                request.get(API_SITES + '/' + info.siteId + '/communities', SERVICE_WINKT_SYSTEM_HEADER).then(res => {
                    setCommunities(res.data.data);
                })
            });
        })
    });
    const onCommunityChanged = (e) => {
        setSelectedCommunity(parseInt(e.detail.value));
    }

    const onFinish = (e) => {
        let validator = getValidator();
        let data = { ...e.detail.value };
        if (selectedCommunity > -1) {
            data.communityId = communities[selectedCommunity].id;
            data.communityName = communities[selectedCommunity].name;
        }
        //验证数据
        validator.addRule(data, [
            {
                name: 'username',
                strategy: 'isEmpty',
                errmsg: '用户名不能为空'
            },
            {
                name: 'mobile',
                strategy: 'phone',
                errmsg: '请输入正确的手机号'
            },
            {
                name: 'communityId',
                strategy: 'isEmpty',
                errmsg: '请选择您所在社区'
            },
        ]);
        setPosting(true);
        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({ title: '错误提醒', content: checked.errmsg, showCancel: false });
            }
            data.community = {id: data.communityId};
            delete data.communityId;
            request.post(API_RECYCLERS_PROXY_ORDER, SERVICE_WINKT_RECYCLER_HEADER, data, true).then((res) => {
                let newOrder = res.data.data;
                Taro.showToast({title: '保存成功', icon: 'success', duration: 1500}).then(()=>{
                    setTimeout(()=>{
                        setPosting(false);
                        Taro.navigateTo({url: 'order_detail?id='+newOrder.id});
                    }, 1500);
                });
            }).catch(() => setPosting(false));

        })
    }
    const openWxLocation = () => {
        Taro.chooseLocation({}).then(res=>{
            // @ts-ignore
            addressRef.current.value = res.address;
        })
    }
    return (
        <PageLayout statusBarProps={{ title: '代用户下单' }} showTabBar={false}>
            <Form onSubmit={onFinish}>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">填写用户信息</Text>
                        <Text className="bg-gradual-green" style="width:3rem" />
                    </View>
                </View>
                <View className="padding bg-white">
                    代用户下单将不会走抢单流程，下单即为接单
                </View>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">用户信息</Text>
                        <Text className="bg-gradual-green" style="width:3rem" />
                    </View>
                </View>
                <View className="cu-form-group">
                    <View className="title">姓名</View>
                    <Input name="username" placeholder="请输入用户的真实姓名" />
                </View>
                <View className="cu-form-group">
                    <View className="title">手机号码</View>
                    <Input name="mobile" placeholder="请输入用户的手机号码" />
                    <View className="cu-capsule radius">
                        <View className="cu-tag bg-blue">
                            +86
                        </View>
                        <View className="cu-tag line-blue">
                            中国大陆
                        </View>
                    </View>
                </View>

                <View className="cu-form-group">
                    <View className="title">社区选择</View>
                    <Picker onChange={onCommunityChanged} value={selectedCommunity} range={communities} rangeKey="name">
                        <View className="picker">
                            {selectedCommunity > -1 ? communities[selectedCommunity].name : '请选择用户所在社区'}
                        </View>
                    </Picker>
                </View>

                <View className="cu-form-group">
                    <View className="title">详细地址</View>
                    <Input placeholder="请输入详细地址" name="address" ref={addressRef} />
                    <Text className="cuIcon-locationfill text-orange" onClick={openWxLocation} />
                </View>

                <Button disabled={posting} loading={posting} formType="submit"
                    className="cu-btn block lg bg-gradual-green shadow no-radius">确认下单</Button>
            </Form>
        </PageLayout>
    );
}

export default withLogin(ProxyOrder);

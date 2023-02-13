import Taro, {useRouter,  useReady} from "@tarojs/taro";
import PageLayout from "../../layouts/PageLayout";
import {Button, Form, Input, Switch, Text, View, Picker} from "@tarojs/components";
import {useRef, useState} from "react";
import getValidator from "../../utils/validator";
import request, {
    API_MEMBER_ADDRESS_EDIT, API_MEMBER_ADDRESS_INFO, SERVICE_WINKT_MEMBER_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";


const NewAddress = (props) => {
    const {makeLogin} = props;
    const [region, setRegion] = useState(['省', '市', '区']);
    const [posting, setPosting] = useState(false);
    const [isDefault, setIsDefault] = useState(false);
    const addressRef = useRef();
    const nameRef = useRef();
    const mobileRef = useRef();
    const defaultRef = useRef();
    const formRef = useRef();
    const {params} = useRouter();

    useReady(()=>{
        if(params.id) {
            request.get(API_MEMBER_ADDRESS_INFO+'/'+params.id, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res=>{
                let address = res.data.data;
                // @ts-ignore
                addressRef.current.value = address.address;
                // @ts-ignore
                nameRef.current.value = address.username;
                // @ts-ignore
                mobileRef.current.value = address.mobile;
                // @ts-ignore
                setIsDefault(Boolean(address.isDefault));
                setRegion([address.province, address.city, address.district]);
            })
        }
    });
    const openWxLocation = () => {
        Taro.chooseLocation({}).then(res=>{
            // @ts-ignore
            addressRef.current.value = res.address;
        })
    }
    const onSubmit = (e) => {
        let data = {...e.detail.value};
        let validator = getValidator();
        if (region.join('') !== '省市区') {
            data.province = region[0];
            data.city = region[1];
            data.district = region[2];
        }
        if(params.id) {
            data.id = params.id;
        }
        //验证数据
        validator.addRule(data, [
            {
                name: 'username',
                strategy: 'isEmpty',
                errmsg: '姓名不能为空'
            },
            {
                name: 'mobile',
                strategy: 'phone',
                errmsg: '请输入正确的手机号'
            },
            {
                name: 'address',
                strategy: 'isEmpty',
                errmsg: '请填写详细地址'
            },
        ]);
        setPosting(true);
        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
            }
            return request.put(API_MEMBER_ADDRESS_EDIT + (params.id?'/'+params.id:'/0'), SERVICE_WINKT_MEMBER_HEADER, data, true).then(() => {
                setPosting(false);
                Taro.navigateBack();
            });
        })
    }
    const onAddressChanged = (e) => {
        setRegion(e.detail.value);
    }
    return (
        <PageLayout statusBarProps={{title: '编辑地址'}}>
            <Form onSubmit={onSubmit} ref={formRef}>
                <View className="cu-form-group">
                    <View className="title">姓名</View>
                    <Input name="username" placeholder="请输入姓名" ref={nameRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">手机号码</View>
                    <Input name="mobile" placeholder="请输入手机号码" ref={mobileRef} />
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
                    <View className="title">地区选择</View>
                    <Picker mode="region" onChange={onAddressChanged} value={region}>
                        <View className="picker">
                            {region[0]},{region[1]},{region[2]}
                        </View>
                    </Picker>
                </View>
                <View className="cu-form-group">
                    <View className="title">详细地址</View>
                    <Input placeholder="请输入详细地址" name="address" ref={addressRef} />
                    <Text className="cuIcon-locationfill text-orange" onClick={openWxLocation} />
                </View>

                <View className="cu-form-group">
                    <View className="title">默认地址</View>
                    <Switch className={'orange'} name="isDefault" ref={defaultRef} checked={isDefault} />
                </View>
                <Button disabled={posting} loading={posting} formType="submit"
                        className="cu-btn block lg bg-orange shadow" style={{margin: '25rpx'}}>保存</Button>
            </Form>

        </PageLayout>
    );
}


export default withLogin(NewAddress)

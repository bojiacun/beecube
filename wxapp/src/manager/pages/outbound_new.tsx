import withLogin from "../../components/login/login";
import Taro, { useReady } from '@tarojs/taro';
import { Button, View, Text, Input, Picker } from "@tarojs/components";
import PageLayout from "../../layouts/PageLayout";
import { useState } from "react";
import request, {
    API_APPOINTMENT_OUTBOUND2,
    API_CLASSES,
    SERVICE_WINKT_ORDER_HEADER,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";

const OUTBOUND_ORDER_CACHE = "OUTBOUND_ORDER_CACHE";


const OutboundNew = (props: any) => {
    const { makeLogin, checkLogin } = props;
    const [classes, setClasses] = useState<any[]>([]);
    const [posting, setPosting] = useState<boolean>(false);
    const [wastes, setWastes] = useState<any[]>([]);
    const isLogined = checkLogin();

    const generateNew = () => {
        makeLogin(() => {
            if(!checkWates()) {
                return;
            }
            setPosting(true);
            request.post(API_APPOINTMENT_OUTBOUND2, SERVICE_WINKT_ORDER_HEADER, {  wastes: wastes.map((item)=>({classId: item.id, classImage: item.classImage, name: item.title, price: item.price, count: item.count, unit: item.unit, money: item.money}))}, true).then(() => {
                Taro.showToast({ title: '出库成功', icon: 'success', duration: 1500 }).then(() => {
                    setTimeout(() => {
                        setPosting(false);
                        Taro.removeStorageSync(OUTBOUND_ORDER_CACHE);
                        Taro.navigateBack().then();
                    }, 1500);
                });
            }).catch(() => setPosting(false));
        })
    }
    const checkWates = () => {
        //验证信息是否准确
        if (wastes.length > 0) {
            let hasError = false;
            wastes.forEach((item) => {
                if (!item.count || !item.id) {
                    hasError = true;
                }
            });
            if (hasError) {
                Taro.showToast({ title: '请选择物品品类并填写数量', icon: 'none', duration: 2000 });
                return false;
            }
        }
        return true;
    }
    const loadData = () => {
        if (isLogined) {
            request.get(API_CLASSES, SERVICE_WINKT_SYSTEM_HEADER).then((res) => {
                setClasses(res.data.data);
            });
        }
    }

    useReady(() => {
        loadData();
    })
    const onClassChanged = (e, item) => {
        let _class = classes[e.detail.value];
        item.title = _class.title;
        item.price = _class.price;
        item.money = _class.money;
        item.unit = _class.unit;
        item.classImage = _class.image;
        item.id = _class.id;
        setWastes([...wastes]);
    }
    const addItem = () => {
        wastes.push({ id: 0, title: '' });
        setWastes([...wastes]);
    }
    const removeItem = (item) => {
        let newWastes = wastes.filter((element) => item.id != element.id);
        setWastes([...newWastes]);
    }
    return (
        <PageLayout statusBarProps={{ title: '新建出库单' }} showTabBar={false}>
            <View className="cu-card no-card article margin-top-sm">
                <View className="cu-item">
                    <View className="title">出库须知</View>
                    <View className="content">
                        出库之后会抵消入库的库存
                    </View>
                </View>
            </View>
            {wastes.map((item) => {
                return (
                    <View className="margin-top" style={{ position: 'relative' }}>
                        <Text onClick={() => removeItem(item)} className="cuIcon-roundclosefill text-red" style={{ position: 'absolute', right: 0, top: -10, fontSize: '48rpx' }} />
                        <View className="cu-form-group">
                            <View className="title">物品分类</View>
                            <Picker onChange={(e) => onClassChanged(e, item)} range={classes} rangeKey="title">
                                <View className="picker">
                                    {item.id > 0 ? item.title : '请选择物品分类'}
                                </View>
                            </Picker>
                        </View>
                        <View className="cu-form-group">
                            <View className="title">物品数量</View>
                            <Input name="count" type="number" onInput={(e) => item.count = e.detail.value} placeholder="请输入物品数量" style={{ textAlign: 'right' }} />
                        </View>
                    </View>
                );
            })}

            <View className="padding-sm text-center text-green margin-top-sm" onClick={addItem}><Text className="cuIcon-add" />增加一个品类</View>
            <View style={{ height: '140rpx' }} />
            <View style={{ position: 'fixed', bottom: 0, width: '100%' }} className="cu-bar tabbar bg-white flex align-center justify-between">
                <Button onClick={generateNew} disabled={posting || wastes.length == 0} loading={posting} className="cu-btn block xl no-radius bg-gradual-red flex-sub shadow">确认出库</Button>
            </View>

        </PageLayout>
    );
}


export default withLogin(OutboundNew)

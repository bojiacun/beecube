import moment from "moment";
import Taro, { useReady } from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import classNames from "classnames";
import { Button, Form, Image, Input, Picker, Text, Textarea, View } from "@tarojs/components";
import { useRef, useState } from "react";
import request, {
    API_APPOINTMENT_NEW,
    API_CLASSES,
    API_MEMBER_INFO_CHECK,
    SERVICE_WINKT_MEMBER_HEADER, SERVICE_WINKT_ORDER_HEADER, SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
// @ts-ignore
import styles from './index.module.scss';
import withLogin from "../../components/login/login";
import { setPosition } from "../../store/actions";


const Appointment = (props) => {
    const startTime = moment().format('YYYY-MM-DD');
    const endTime = moment().add(1, 'years').format('YYYY-MM-DD');
    const { context, dispatch, checkLogin, makeLogin } = props;
    const [classes, setClasses] = useState<any[]>([]);
    const [wastes, setWastes] = useState<any[]>([]);
    const { settings, position } = context;
    const [confirmSubscribeMessage, setConfirmSubscribeMessage] = useState(false);
    const [time, setTime] = useState(startTime);
    const [time2, setTime2] = useState(moment().add(30, 'minutes').format("HH:mm"));
    const [note, setNote] = useState('');
    const [licenseVisible, setLicenseVisible] = useState(false);
    const [posting, setPosting] = useState(false);
    const formRef = useRef();
    const isLogined = checkLogin();



    const loadData = () => {
        if (isLogined) {
            request.get(API_CLASSES, SERVICE_WINKT_SYSTEM_HEADER).then((res) => {
                setClasses(res.data.data);
            });
        }
    }

    useReady(() => {
        loadData();
    });
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
    const selectTime = (e) => {
        setTime(e.detail.value);
    }
    const selectTime2 = (e) => {
        setTime2(e.detail.value);
    }
    const closeLicense = () => {
        setLicenseVisible(false);
    }

    const noteChanged = (e) => {
        setNote(e.detail.value);
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
    const onFinish = (e) => {
        //预约下单
        const data = e.detail.value;

        if(!checkWates()) {
            return;
        }


        setPosting(true);
        data.serviceAt = moment(time + ' ' + time2).unix();
        data.wastes = wastes.map((item)=>({classId: item.id, classImage: item.classImage, name: item.title, price: item.price, count: item.count, unit: item.unit, money: item.money}));
        //获取定位信息
        const doSubmit = () => {
            Taro.getLocation({ isHighAccuracy: true, type: 'gcj02' }).then(pos => {
                dispatch(setPosition({ lat: pos.latitude, lng: pos.longitude }));
                data.lat = pos.latitude;
                data.lng = pos.longitude;
                request.post(API_APPOINTMENT_NEW, SERVICE_WINKT_ORDER_HEADER, data, true).then((res) => {
                    setPosting(false);
                    Taro.redirectTo({ url: 'success?id=' + res.data.data.id }).then()
                }).catch(() => setPosting(false));
            }).catch(() => {
                if (position) {
                    data.lat = position.lat;
                    data.lng = position.lng;
                    request.post(API_APPOINTMENT_NEW, SERVICE_WINKT_ORDER_HEADER, data, true).then((res) => {
                        setPosting(false);
                        Taro.redirectTo({ url: 'success?id=' + res.data.data.id }).then()
                    }).catch(() => setPosting(false));
                } else {
                    data.lat = null;
                    data.lng = null;
                    request.post(API_APPOINTMENT_NEW, SERVICE_WINKT_ORDER_HEADER, data, true).then((res) => {
                        setPosting(false);
                        Taro.redirectTo({ url: 'success?id=' + res.data.data.id }).then()
                    }).catch(() => setPosting(false));
                }
            })
        }
        request.get(API_MEMBER_INFO_CHECK, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
            if (res.data.data) {
                doSubmit();
            }
            else {
                setPosting(false);
                Taro.navigateTo({ url: '/pages/my/register' });
            }
        }).catch(() => setPosting(false));
    }

    const doSubscribeMessage = () => {
        if(!checkWates()) {
            return;
        }
        setPosting(true);
        Taro.requestSubscribeMessage({
            tmplIds: [settings.tmpIdOrderConfirm]
        }).then((res) => {
            console.log('用户订阅了消息', res);
            setConfirmSubscribeMessage(true);
            return onFinish({ detail: { value: { note: note } } })
        }).catch((error) => {
            console.warn('用户未订阅了消息', error);
            return onFinish({ detail: { value: { note: note } } })
        });
    }


    return (
        <PageLayout showTabBar={false} statusBarProps={{ title: '预约' }}>
            <View className="cu-card no-card article margin-top-sm">
                <View className="cu-item">
                    <View className="title">回收要求</View>
                    <View className="content">
                        <View className="flex-sub flex flex-direction align-center">
                            <Image src='../../assets/images/jjcs.png' mode="widthFix" style={{ width: 50 }} />
                            <Text>拒绝破损</Text>
                        </View>
                        <View className="flex-sub flex flex-direction align-center">
                            <Image src='../../assets/images/jjcz.png' mode="widthFix" style={{ width: 50 }} />
                            <Text>拒绝参杂</Text>
                        </View>
                        <View className="flex-sub flex flex-direction align-center">
                            <Image src='../../assets/images/10kg.png' mode="widthFix" style={{ width: 50 }} />
                            <Text>足够数量</Text>
                        </View>
                    </View>
                </View>
            </View>
            <Form onSubmit={onFinish} ref={formRef}>
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
                                <Input name="count" type="number" onInput={(e)=>item.count = e.detail.value} placeholder="请输入物品数量" style={{ textAlign: 'right' }} />
                            </View>
                        </View>
                    );
                })}
                <View className="padding-sm text-center text-green margin-top-sm" onClick={addItem}><Text className="cuIcon-add" />增加一个品类</View>
                <View className="margin-top-sm">
                    <View className="cu-form-group">
                        <view className="title text-bold">上门日期</view>
                        <Picker mode="date" value={time} start={startTime} end={endTime}
                            onChange={selectTime}>
                            <View className="picker">{time}</View>
                        </Picker>
                    </View>
                    <View className="cu-form-group">
                        <view className="title text-bold">预约大致时间</view>
                        <Picker mode="time" value={time2} start="00:00" end="24:00"
                            onChange={selectTime2}>
                            <View className="picker">{time2}</View>
                        </Picker>
                    </View>


                    <View className="cu-form-group align-start">
                        <View className="title text-bold">备注</View>
                        <Textarea name="note" maxlength={-1} placeholder="垃圾的种类、大致重量或其他备注信息，如纸壳1公斤" onInput={noteChanged} value={note} />
                    </View>
                </View>
                <View className="cu-card no-card article margin-top-sm">
                    <View className="cu-item">
                        <View className="content flex-direction">
                            <View className="padding-sm text-gray text-sm">确认下单，将自动默认接受 <Text className="text-green" onClick={() => setLicenseVisible(true)}>《上门回收免责条款》</Text></View>
                            {isLogined && confirmSubscribeMessage && <Button loading={posting} disabled={posting} formType="submit" className="cu-btn block lg shadow bg-gradual-green">预约下单</Button>}
                            {isLogined && !confirmSubscribeMessage && <Button loading={posting} disabled={posting} onClick={doSubscribeMessage} className="cu-btn block lg shadow bg-gradual-green">预约下单</Button>}
                            {!isLogined && <Button onClick={() => makeLogin()} className="cu-btn block lg shadow bg-gradual-green">点击登录</Button>}
                        </View>
                    </View>
                </View>
            </Form>
            <View className={classNames("cu-modal", licenseVisible ? 'show' : '')}>
                <View className="cu-dialog bg-white radius-lg">
                    <View className="cu-bar justify-end">
                        <View className="content">上门回收免责条款</View>
                        <View className="action">
                            <Text className="cuIcon-close" onClick={closeLicense} />
                        </View>
                    </View>
                    <View className="padding-xl">
                        {settings.exemption_treaty}
                    </View>
                </View>
            </View>
        </PageLayout>
    );
}

export default withLogin(Appointment)

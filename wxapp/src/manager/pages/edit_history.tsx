import { useRef, useState } from "react";
import {
    Button,
    Form,
    Input, Label, Radio, RadioGroup,
    Text,
    View
} from "@tarojs/components";
import Taro, {useReady, useRouter} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import getValidator from "../../utils/validator";
import request, {
    API_UPLOADFILE,
    resolveUrl,
    SERVICE_WINKT_COMMON_HEADER, SERVICE_WINKT_LIVE_HEADER,
} from "../../utils/request";
import util from '../../utils/we7/util';
import _ from 'lodash';
import {InputProps} from "@tarojs/components/types/Input";
import DateTimePicker from "../../components/DateTimePicker";
import moment from "moment";


const EditLiveHistory = (props) => {
    const {makeLogin} = props;
    const [pictures, setPictures] = useState<any>(['']);
    const [posting, setPosting] = useState(false);
    const [info, setInfo] = useState<any>();
    const {params} = useRouter();

    const nameRef = useRef<InputProps>();
    const tagsRef = useRef<InputProps>();
    const priceRef = useRef<InputProps>();
    const startAtRef = useRef<InputProps>();
    const endAtRef = useRef<InputProps>();
    const goodsTypeRef = useRef<InputProps>();

    useReady(() => {
        if(params.id) {
            request.get("wxapp/manager/live/histories/" + params.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                let detail = res.data.data;
                setInfo(detail);
                setPictures([detail.image, detail.banner]);
                nameRef.current!.value = detail.name;
                tagsRef.current!.value = detail.tags;
                priceRef.current!.value = detail.price;
                startAtRef.current!.value = moment(detail.startAt).format("yyyy-MM-DD HH:mm:ss");
                endAtRef.current!.value = moment(detail.endAt).format("yyyy-MM-DD HH:mm:ss");
            });
        }
    })


    const chooseImage = (index) => {
        Taro.chooseImage({
            count: 1, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
        }).then(res => {
            pictures[index] = res.tempFilePaths[0];
            Taro.showLoading({ title: '正在上传文件' });
            return Taro.uploadFile({
                url: util.url(API_UPLOADFILE),
                filePath: pictures[index],
                name: 'file',
                header: { 'X-Requested-With': 'XMLHttpRequest', 'X-Requested-Service': SERVICE_WINKT_COMMON_HEADER, 'Authorization': 'Bearer ' + util.getToken() },
                formData: { 'chunks': 1, 'chunk': 0, name: pictures[index], 'type': 1 }
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
    const onFinish = (e) => {
        let validator = getValidator();
        let data = { ...e.detail.value };
        data.image = pictures[0] ? pictures[0] : null;
        data.banner = pictures[1] ? pictures[1] : null;
        data.goodsType = goodsTypeRef.current?.value ?? 2;
        setPosting(true);
        //验证数据
        validator.addRule(data, [
            {
                name: 'name',
                strategy: 'isEmpty',
                errmsg: '商品标题不能为空'
            },
            {
                name: 'startAt',
                strategy: 'isEmpty',
                errmsg: '必须填写预计开播时间'
            },
            {
                name: 'endAt',
                strategy: 'isEmpty',
                errmsg: '必须填写直播预计的结束时间'
            },
            {
                name: 'image',
                strategy: 'isEmpty',
                errmsg: '请至少上传一张海报图'
            },
            {
                name: 'banner',
                strategy: 'isEmpty',
                errmsg: '请上传直播等待背景图'
            },
        ]);
        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({ title: '错误提醒', content: checked.errmsg, showCancel: false });
            }
            data.startAt = moment(data.startAt).valueOf();
            data.endAt = moment(data.endAt).valueOf();

            if(!info) {
                return request.post("wxapp/manager/live/histories", SERVICE_WINKT_LIVE_HEADER, data, true).then(() => {
                    setPosting(false);
                    Taro.showToast({title: '保存成功', icon: 'success'}).then(() => {
                        setTimeout(() => {
                            Taro.navigateBack().then();
                        }, 1000);
                    });
                }).catch(() => setPosting(false));
            }
            else {
                return request.put("wxapp/manager/live/histories/"+info.id, SERVICE_WINKT_LIVE_HEADER, data, true).then(() => {
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

    const handleGoodsTypeChanged = (e) => {
        goodsTypeRef.current!.value = e.detail.value;
    }

    // @ts-ignore
    return (
        <PageLayout statusBarProps={{ title: info ? '编辑直播':'新建直播'}}>
            <Form onSubmit={onFinish}>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">基本信息</Text>
                        <Text className="bg-gradual-orange" style="width:3rem" />
                    </View>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>标题</View>
                    <Input name="name" placeholder="请输入直播标题" ref={nameRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">直播类型</View>
                    <RadioGroup name={'goodsType'} onChange={handleGoodsTypeChanged} className={'flex align-center'} ref={goodsTypeRef}>
                        <Label className={'margin-right'}>
                            <Radio value={'1'} checked={info?.goodsType == 1} className={'margin-right-xs orange'}/> 商城类
                            <Radio value={'2'} checked={!info?.goodsType || info?.goodsType == 2} className={'margin-right-xs orange'}/> 借阅类
                        </Label>
                    </RadioGroup>
                </View>
                <View className="cu-form-group">
                    <view className="title"><Text className={'text-red'}>*</Text>开播时间</view>
                    <DateTimePicker ref={startAtRef} name='startAt' disabled={info} placeholder='直播预计开播时间' />
                </View>
                <View className="cu-form-group">
                    <view className="title"><Text className={'text-red'}>*</Text>结束时间</view>
                    <DateTimePicker ref={endAtRef} name='endAt' disabled={info} placeholder='直播预计结束时间' />
                </View>
                <View className="cu-form-group">
                    <View className="title">标签</View>
                    <Input name="tags" placeholder='标签，以英文逗号分割例如：3-6岁,美术' ref={tagsRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">付费直播</View>
                    <Input name="price" placeholder="观看直播所需费用，不填不收费" type='digit' ref={priceRef} />
                </View>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">宣传海报</Text>
                        <Text className="bg-gradual-orange" style="width:3rem" />
                    </View>
                </View>
                <View className="padding bg-white">
                    <View className="grid col-1">
                        <View onClick={() => chooseImage(0)} style={{
                            position: 'relative',
                            height: '360rpx',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            backgroundImage: pictures[0]? 'url(' + resolveUrl(pictures[0]) + ')' : 'none'
                        }}
                              className="bg-gray margin-bottom-sm padding radius-lg flex align-center justify-center flex-direction">
                            {
                                !pictures[0] &&
                                <> <Text className="cuIcon-add" style={{ fontSize: 48, color: '#aaa' }} />
                                    <View>宣传海报</View></>
                            }
                        </View>
                    </View>
                </View>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">等待背景图</Text>
                        <Text className="bg-gradual-orange" style="width:3rem" />
                    </View>
                </View>
                <View className="padding bg-white">
                    <View className="grid col-1">
                        <View onClick={() => chooseImage(1)} style={{
                            position: 'relative',
                            height: '360rpx',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            backgroundImage: pictures[1] ? 'url(' + resolveUrl(pictures[1]) + ')' : 'none'
                        }}
                              className="bg-gray margin-bottom-sm padding radius-lg flex align-center justify-center flex-direction">
                            {
                                !pictures[1] &&
                                <> <Text className="cuIcon-add" style={{ fontSize: 48, color: '#aaa' }} />
                                    <View>背景图</View></>
                            }
                        </View>
                    </View>
                </View>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">直播参数</Text>
                        <Text className="bg-gradual-orange" style="width:3rem" />
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item" style={{display: 'block'}}>
                        <View className="content padding-top padding-bottom" style={{wordWrap: 'break-word'}}> 推流地址：{info?.pushAddress} </View>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item" style={{display: 'block'}}>
                        <View className="content padding-top padding-bottom" style={{wordWrap: 'break-word'}}> RTMP播放地址：{info?.rtmpPlayAddress} </View>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item" style={{display: 'block'}}>
                        <View className="content padding-top padding-bottom" style={{wordWrap: 'break-word'}}> FLV播放地址：{info?.flvPlayAddress} </View>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item" style={{display: 'block'}}>
                        <View className="content padding-top padding-bottom" style={{wordWrap: 'break-word'}}> HLS播放地址：{info?.hlsPlayAddress} </View>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item" style={{display: 'block'}}>
                        <View className="content padding-top padding-bottom" style={{wordWrap: 'break-word'}}> WEBRTC播放地址：{info?.webrtcPlayAddress} </View>
                    </View>
                </View>
                <View style={{height: '200rpx'}} />
                <View className={'cu-bar tabbar'} style={{width: '100%', position: 'fixed', bottom: 0, zIndex: 999}}>
                    <Button disabled={posting} loading={posting} formType="submit"
                            className="cu-btn block lg bg-orange no-radius" style={{width: '100%'}}>保存</Button>
                </View>
            </Form>
        </PageLayout>
    );
}

export default withLogin(EditLiveHistory)

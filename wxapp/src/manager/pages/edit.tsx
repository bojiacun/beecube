import { useRef, useState } from "react";
import {
    Button,
    Form,
    Input, ITouchEvent,
    Picker,
    Switch, SwitchProps,
    Text, Textarea, TextareaProps,
    View
} from "@tarojs/components";
import Taro, {useReady, useRouter} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import getValidator from "../../utils/validator";
import request, {
    API_SHOP_GOODS_CLASSES, API_SHOP_GOODS_INFO,
    API_UPLOADFILE,
    resolveUrl,
    SERVICE_WINKT_COMMON_HEADER,
    SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import util from '../../utils/we7/util';
import _ from 'lodash';
import {InputProps} from "@tarojs/components/types/Input";


const EditShopGoods = (props) => {
    const {makeLogin} = props;
    const [pictures, setPictures] = useState<any>([]);
    const [details, setDetails] = useState<any>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [posting, setPosting] = useState(false);
    const [selectedClassIndex, setSelectedClassIndex] = useState<number>(-1);
    const [info, setInfo] = useState<any>();
    const {params} = useRouter();

    const identifierRef = useRef<InputProps>();
    const nameRef = useRef<InputProps>();
    const shortNameRef = useRef<InputProps>();
    const tagsRef = useRef<InputProps>();
    const descriptionRef = useRef<TextareaProps>();
    const priceRef = useRef<InputProps>();
    const marketPriceRef = useRef<InputProps>();
    const soledRef = useRef<InputProps>();
    const storeRef = useRef<InputProps>();
    const isFreeDeliveryRef = useRef<SwitchProps>();
    const isMemberPrivateRef = useRef<SwitchProps>();
    const isSugguestRef = useRef<SwitchProps>();

    useReady(() => {
        request.get(API_SHOP_GOODS_CLASSES, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>{
            let shopClasses = res.data.data;
            setClasses(shopClasses);
            if(params.id) {
                request.get(API_SHOP_GOODS_INFO + "/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                    let detail = res.data.data;
                    setInfo(detail);
                    setSelectedClassIndex(_.findIndex(shopClasses, {id: detail.shopClass.id}));
                    identifierRef.current!.value = detail.identifier;
                    nameRef.current!.value = detail.name;
                    shortNameRef.current!.value = detail.shortName;
                    priceRef.current!.value = detail.price;
                    marketPriceRef.current!.value = detail.marketPrice;
                    storeRef.current!.value = detail.store;
                    tagsRef.current!.value = detail.tags;
                    soledRef.current!.value = detail.soled;
                    descriptionRef.current!.value = detail.description;
                    isFreeDeliveryRef.current!.checked = detail.isFreeDelivery;
                    isSugguestRef.current!.checked = detail.isSugguest;
                    isMemberPrivateRef.current!.checked = detail.isMemberPrivate;
                    setPictures(detail.images.split(','));
                });
            }
        });
    })

    const onClassChanged = (e) => {
        let index = parseInt(e.detail.value);
        setSelectedClassIndex(index);
    }

    const addPictures = () => {
        pictures.push('');
        setPictures([...pictures]);
    }

    const addDetails = () => {
        details.push('');
        setDetails([...details]);
    }
    const removeDetail = (index, e: ITouchEvent) => {
        e.stopPropagation();
        details.splice(index, 1);
        setDetails([...details]);
    }
    const removePicture = (index, e: ITouchEvent) => {
        e.stopPropagation();
        pictures.splice(index, 1);
        setPictures([...pictures]);
    }
    const doScanCode = () => {
        Taro.scanCode({}).then(res=>{
            if(res) {
                identifierRef.current!.value = res.result;
            }
        }).catch(()=>Taro.showToast({title: '扫码失败', icon: 'error'}).then())
    }

    const chooseImage = (index) => {
        Taro.chooseImage({
            count: 1, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], //从相册选择
        }).then(res => {
            pictures[index] = res.tempFilePaths[0];
            Taro.showLoading({ title: '正在上传文件' }).then();
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
        data.pictures = [...pictures];
        data.shopClass = selectedClassIndex > -1 ? {id: classes[selectedClassIndex].id} : null;
        setPosting(true);
        //验证数据
        validator.addRule(data, [
            {
                name: 'shopClass',
                strategy: 'isEmpty',
                errmsg: '请选择商品所在分类'
            },
            {
                name: 'name',
                strategy: 'isEmpty',
                errmsg: '商品标题不能为空'
            },
            {
                name: 'shortName',
                strategy: 'isEmpty',
                errmsg: '商品副标题不能为空'
            },
            {
                name: 'identifier',
                strategy: 'isEmpty',
                errmsg: '编号不能为空'
            },
            {
                name: 'price',
                strategy: 'isEmpty',
                errmsg: '请输入商品价格'
            },
            {
                name: 'pictures',
                strategy: 'isEmpty',
                errmsg: '请至少上传一张预览图'
            },
        ]);
        if(!info) {
            validator.addRule(data, [
                {
                    name: 'store',
                    strategy: 'isEmpty',
                    errmsg: '请输入初始库存'
                },
            ]);
        }

        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({ title: '错误提醒', content: checked.errmsg, showCancel: false });
            }
            data.images = pictures.join(',');
            data.details = details.join(',');

            if(!info) {
                return request.post("wxapp/manager/shop/goods", SERVICE_WINKT_SYSTEM_HEADER, data, true).then(() => {
                    setPosting(false);
                    Taro.showToast({title: '保存成功', icon: 'success'}).then(() => {
                        setTimeout(() => {
                            Taro.navigateBack().then();
                        }, 1000);
                    });
                }).catch(() => setPosting(false));
            }
            else {
                return request.put("wxapp/manager/shop/goods/"+info.id, SERVICE_WINKT_SYSTEM_HEADER, data, true).then(() => {
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
        <PageLayout statusBarProps={{ title: info ? '编辑商城图书':'新建商城图书'}}>
            <Form onSubmit={onFinish}>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">基本信息</Text>
                        <Text className="bg-gradual-orange" style="width:3rem" />
                    </View>
                </View>
                <View className="cu-form-group">
                    <View className="title">选择分类</View>
                    <Picker onChange={onClassChanged} value={selectedClassIndex} range={classes} rangeKey="title">
                        <View className="picker">
                            {selectedClassIndex > -1 ? classes[selectedClassIndex].title: '请选择分类'}
                        </View>
                    </Picker>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>编号</View>
                    <Input name="identifier" placeholder="图书编号" ref={identifierRef} />
                    <Text className={'cuIcon-scan'} onClick={doScanCode} />
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>标题</View>
                    <Input name="name" placeholder="请输入标题" ref={nameRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>书名</View>
                    <Input name="shortName" placeholder="请输入书名" ref={shortNameRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">作者</View>
                    <Input name="author" placeholder='图书作者' ref={tagsRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">标签</View>
                    <Input name="tags" placeholder='商品标签，以英文逗号分割例如：3-6岁,美术' ref={tagsRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">商品描述</View>
                    <Textarea name='description' placeholder='商品描述信息可不填' ref={descriptionRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>售价</View>
                    <Input name="price" placeholder="商品价格" type='digit' ref={priceRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">图书定价</View>
                    <Input name="marketPrice" placeholder="请输入图书定价" type='digit' ref={marketPriceRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>初始库存</View>
                    <Input name="store" placeholder="初始库存" disabled={info} type={'number'} ref={storeRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">销量</View>
                    <Input name="soled" placeholder="初始销量" type={'number'} ref={soledRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">包邮</View>
                    <Switch name='isFreeDelivery' className='orange' checked={isFreeDeliveryRef.current?.checked} ref={isFreeDeliveryRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">推荐</View>
                    <Switch name='isSugguest' className='orange' checked={isSugguestRef.current?.checked} ref={isSugguestRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title">会员专享</View>
                    <Switch name='isMemberPrivate' className='orange' checked={isMemberPrivateRef.current?.checked} ref={isMemberPrivateRef} />
                </View>

                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">预览图</Text>
                        <Text className="bg-gradual-orange" style="width:3rem" />
                    </View>
                </View>
                <View className="padding bg-white">
                    <View className="grid col-1">
                        {pictures.map((item, index)=>{
                            return (
                                <View onClick={() => chooseImage(index)} style={{
                                    position: 'relative',
                                    height: '360rpx',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center center',
                                    backgroundSize: 'cover',
                                    backgroundImage: item ? 'url(' + resolveUrl(item) + ')' : 'none'
                                }}
                                      className="bg-gray margin-bottom-sm padding radius-lg flex align-center justify-center flex-direction">
                                    <Text onClick={(e)=>removePicture(index, e)} className={'cuIcon-close bg-red round text-lg padding-xs'} style={{position: 'absolute', right: '10rpx', top: '10rpx', zIndex: 999}} />
                                    {
                                        !item &&
                                        <> <Text className="cuIcon-add" style={{ fontSize: 48, color: '#aaa' }} />
                                            <View>预览图{index+1}</View></>
                                    }
                                </View>
                            );
                        })}
                    </View>
                    <View onClick={addPictures} className={'text-sm text-center text-orange'}><Text className={'cuIcon-add'} />继续添加预览图</View>
                </View>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">详情图</Text>
                        <Text className="bg-gradual-orange" style="width:3rem" />
                    </View>
                </View>
                <View className="padding bg-white">
                    <View className="grid col-1">
                        {details.map((item, index)=>{
                            return (
                                <View onClick={() => chooseImage(index)} style={{
                                    position: 'relative',
                                    height: '360rpx',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center center',
                                    backgroundSize: 'cover',
                                    backgroundImage: item ? 'url(' + resolveUrl(item) + ')' : 'none'
                                }}
                                      className="bg-gray margin-bottom-sm padding radius-lg flex align-center justify-center flex-direction">
                                    <Text onClick={(e)=>removeDetail(index, e)} className={'cuIcon-close bg-red round text-lg padding-xs'} style={{position: 'absolute', right: '10rpx', top: '10rpx', zIndex: 999}} />
                                    {
                                        !item &&
                                        <> <Text className="cuIcon-add" style={{ fontSize: 48, color: '#aaa' }} />
                                            <View>详情图1</View></>
                                    }
                                </View>
                            );
                        })}
                    </View>
                    <View onClick={addDetails} className={'text-sm text-orange text-center'}><Text className={'cuIcon-add'} />继续添加详情图</View>
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

export default withLogin(EditShopGoods)

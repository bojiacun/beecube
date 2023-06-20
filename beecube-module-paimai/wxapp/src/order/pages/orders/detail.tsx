import {Component} from "react";
import {Button, Navigator, Text, View} from "@tarojs/components";
import {connect} from "react-redux";
import PageLayout from "../../../layouts/PageLayout";
import PageLoading from "../../../components/pageloading";
import utils from "../../../lib/utils";
import request, {API_URL} from "../../../lib/request";
import FallbackImage from "../../../components/FallbackImage";
import Taro from "@tarojs/taro";
import {Popup, Radio, Uploader, Button as TaroifyButton} from "@taroify/core";

const numeral = require('numeral');

const ORDER_TYPES = {
    '1': '拍卖订单',
    '2': '一口价订单'
}
const ORDER_STATUS = {
    '0': '待支付',
    '1': '待发货',
    '2': '待收货',
    '3': '已完成',
    '4': '申请售后',
}

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        id: 0,
        detail: null,
        posting: false,
        address: null,
        afters: [],
        openNetPay: false,
        openUploadPay: false,
        banks: [],
        file: null,
    }

    constructor(props) {
        super(props);
        this.pay = this.pay.bind(this);
        this.requestAfter = this.requestAfter.bind(this);
        this.cancel = this.cancel.bind(this);
        this.loadDefaultAddress = this.loadDefaultAddress.bind(this);
        this.confirmDelivery = this.confirmDelivery.bind(this);
        this.loadAfters = this.loadAfters.bind(this);
        this.cancelAfter = this.cancelAfter.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.showUploadNetPay = this.showUploadNetPay.bind(this);
        this.copyBank = this.copyBank.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.setUploadFile = this.setUploadFile.bind(this);
        this.confirmUpload = this.confirmUpload.bind(this);
        this.handlePayTypeChanged = this.handlePayTypeChanged.bind(this);
    }

    handlePayTypeChanged(value) {
        this.state.detail.payType = value;
        this.setState({detail: this.state.detail});
    }

    async confirmUpload() {
        const res = await request.get('/app/api/members/tmptoken');
        const token = res.data.result;
        let file = this.state.file;
        if (!file) {
            return utils.showError('请上传转账凭证');
        }
        Taro.uploadFile({
            url: API_URL + '/sys/oss/file/upload',
            name: 'file',
            filePath: file.url,
            header: {
                "X-Access-Token": token,
                "Authorization": token,
                "Content-Type": 'application/json'
            }
        }).then(async (res: any) => {
            let result = JSON.parse(res.data);
            let url = result.result.url;
            await request.put('/paimai/api/orders/netpay', {payImage: url, orderId: this.state.detail.id});
            utils.showSuccess(true, '上传成功,等待审核');
        });
    }

    copyBank(bank) {
        let data = `${bank.bankName} ${bank.bankAddress} ${bank.bankCode}`;
        Taro.setClipboardData({data: data}).then(() => {
            utils.showSuccess(false, '复制成功');
        }).catch(() => {
            utils.showError('复制失败');
        });
    }

    showUploadNetPay() {
        this.setState({openNetPay: false, openUploadPay: true});
    }

    componentDidMount() {
        //加载银行信息
        request.get('/paimai/api/banks').then(res => {
            this.setState({banks: res.data.result});
        });
    }

    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        request.get("/paimai/api/members/orders/detail", {params: {id: options.id}}).then(res => {
            let data = res.data.result;
            let address = {
                id: data.deliveryId,
                username: data.deliveryUsername,
                phone: data.deliveryPhone,
                address: data.deliveryAddress,
                city: data.deliveryCity,
                district: data.deliveryDistrict,
                province: data.deliveryProvince
            };
            if (address.id) {
                Taro.setStorageSync('ADDRESS', JSON.stringify(address));
            }
            utils.hideLoading();
            this.setState({detail: data, address: address});
            this.loadDefaultAddress(data);
            this.loadAfters(data);
        });
    }

    confirmDelivery() {
        //用户确认收货
        this.setState({posting: true});
        request.put('/paimai/api/members/confirm_delivery', {}, {params: {id: this.state.detail.id}}).then(() => {
            this.setState({posting: false});
            utils.showSuccess(true, '确认收货成功');
        })
    }

    cancelAfter(item: any) {
        this.setState({posting: true});
        request.put('/paimai/api/orders/cancel_after', {}, {params: {id: item.id}}).then(() => {
            this.setState({posting: false});
            utils.showSuccess(false, '取消成功');
            this.refreshData();
        })
    }

    loadAfters(detail) {
        if (detail.status == 4) {
            request.get('/paimai/api/orders/afters', {params: {id: detail.id}}).then(res => {
                this.setState({afters: res.data.result});
            })
        }
    }

    loadDefaultAddress(detail: any) {
        if (detail && detail.status == 0) {
            //获取用户默认地址, 优先读取本地存储的地址信息，没有则读取远程服务器信息
            const address = Taro.getStorageSync('ADDRESS');
            if (address) {
                this.setState({address: JSON.parse(address)});
            } else {
                request.get('/app/api/members/addresses/default', {params: {id: ''}}).then(res => {
                    this.setState({address: res.data.result});
                })
            }
        }
    }

    componentDidShow() {
        if (this.state.detail) {
            this.loadDefaultAddress(this.state.detail);
            this.refreshData();
        }
    }

    refreshData() {
        request.get("/paimai/api/members/orders/detail", {params: {id: this.state.detail.id}}).then(res => {
            let data = res.data.result;
            this.setState({detail: data});
            this.loadAfters(data);
        });
    }

    async subscribeMessage() {
        const settings = this.props.settings;
        if(settings.orderNotPayTemplateId || settings.orderDeliveryTemplateId) {
            await Taro.requestSubscribeMessage({tmplIds: [settings.orderNotPayTemplateId, settings.orderDeliveryTemplateId]});
        }
        return true;
    }
    async pay() {
        if (!this.state.address) {
            return utils.showError("请选择收货地址");
        }
        const subs = await this.subscribeMessage();
        if(!subs) return;

        if (this.state.detail.payType == 1) {
            this.setState({posting: true});
            //支付宝保证金
            request.post('/paimai/api/members/orders/pay', this.state.address, {params: {id: this.state.detail.id}}).then(res => {
                let data = res.data.result;
                data.package = data.packageValue;
                Taro.requestPayment(data).then(() => {
                    //支付已经完成，提醒支付成功并返回上一页面
                    this.setState({posting: false});
                    utils.showSuccess(true, '支付成功');
                }).catch(() => this.setState({posting: false}));
            });
        } else {
            this.setState({openNetPay: true});
        }
    }

    cancel() {
        request.post('/paimai/api/members/orders/cancel', null, {params: {id: this.state.detail.id}}).then(res => {
            let result = res.data.result;
            if (result) {
                utils.showSuccess(true, "取消成功");
            } else {
                utils.showMessage("取消失败");
            }
        });
    }

    requestAfter() {
        Taro.navigateTo({url: 'after'}).then();
    }


    renderButton() {
        const {detail} = this.state;
        const {systemInfo} = this.props;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        switch (detail.status) {
            case 0:
                if(detail.payType == 2 && detail.payImage) {
                    return (
                        <View className={'bg-white px-4 pt-1 flex items-center justify-end fixed bottom-0 w-full'}
                              style={{paddingBottom: safeBottom}}>
                            <View className={'flex items-center space-x-2'}>
                                <Button disabled={this.state.posting} className={'btn btn-outline'} onClick={this.cancel}>
                                    <View>取消订单</View>
                                </Button>
                                <Button disabled={true} className={'btn btn-primary'}>
                                    <View>已上传，审核中</View>
                                </Button>
                            </View>
                        </View>
                    );
                }
                return (
                    <View className={'bg-white px-4 pt-1 flex items-center justify-end fixed bottom-0 w-full'}
                          style={{paddingBottom: safeBottom}}>
                        <View className={'flex items-center space-x-2'}>
                            <Button disabled={this.state.posting} className={'btn btn-outline'} onClick={this.cancel}>
                                <View>取消订单</View>
                            </Button>
                            <Button disabled={this.state.posting} className={'btn btn-primary'} onClick={this.pay}>
                                <View>{detail.payType == 1 ? '立即支付' : '上传转账凭证'}</View>
                            </Button>
                        </View>
                    </View>
                );
                break;
            case 1:
                return (
                    <View className={'bg-white px-4 pt-1 flex items-center justify-end fixed bottom-0 w-full'}
                          style={{paddingBottom: safeBottom}}>
                        <View className={'flex space-x-2'}>
                            <View className={'flex items-center'}>
                                <Button openType={'contact'} className={'btn btn-outline'}>
                                    <View className={'space-x-2'}><Text className={'iconfont icon-lianxikefu '}/>联系客服</View>
                                </Button>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <Button disabled={this.state.posting} className={'btn btn-outline'} onClick={this.cancel}>
                                    <View>取消订单</View>
                                </Button>
                            </View>
                        </View>
                    </View>
                );
                break;
            case 2:
                return (
                    <View className={'bg-white px-4 pt-1 flex items-center justify-end fixed bottom-0 w-full'}
                          style={{paddingBottom: safeBottom}}>
                        <View className={'flex items-center space-x-2'}>
                            <Button disabled={this.state.posting} className={'btn btn-primary'} onClick={this.confirmDelivery}>
                                <View>确认收货</View>
                            </Button>
                        </View>
                    </View>
                );
                break;
        }
        return <></>
    }

    setUploadFile(file) {
        this.setState({file: file});
    }

    onUpload() {
        Taro.chooseImage({
            count: 1,
            sizeType: ["original", "compressed"],
            sourceType: ["album", "camera"],
        }).then(({tempFiles}) => {
            this.setState({
                file: {
                    url: tempFiles[0].path,
                    type: tempFiles[0].type,
                    name: tempFiles[0].originalFileObj?.name,
                }
            });
        })
    }

    componentWillUnmount() {

    }

    render() {
        const {detail, address, afters, openUploadPay, openNetPay, banks} = this.state;
        if (detail == null) return <PageLoading/>;


        return (
            <PageLayout statusBarProps={{title: '订单详情'}}>
                <View className={'space-y-4 p-4 head-bg'}>
                    <View className={'text-white mt-4'}>
                        <View className={'text-3xl'}> {ORDER_STATUS[detail.status]} </View>
                        <View></View>
                    </View>
                    <View className={'bg-white p-4 rounded-lg space-y-4'}>
                        <View className={'font-bold item-title text-lg'}>收货地址</View>
                        <View className={'space-y-4'}>
                            {detail.status == 0 && !detail.deliveryId &&
                                <Navigator url={'/pages/my/addresses'} className={'flex items-center justify-between'}>
                                    <View className={'flex-1 space-y-2'}>
                                        <View className={'font-bold space-x-2'}>
                                            <Text className={'text-lg'}>{address?.username}</Text><Text>{address?.phone}</Text>
                                        </View>
                                        <View
                                            className={'text-gray-400'}>{address?.province} {address?.city} {address?.district} {address?.address}</View>
                                    </View>
                                    <View className={'px-2'}>
                                        <Text className={'fa fa-chevron-right'}/>
                                    </View>
                                </Navigator>
                            }
                            {detail.deliveryId &&
                                <View className={'flex items-center justify-between'}>
                                    <View className={'flex-1 space-y-2'}>
                                        <View className={'font-bold space-x-2'}>
                                            <Text className={'text-lg'}>{address?.username}</Text><Text>{address?.phone}</Text>
                                        </View>
                                        <View
                                            className={'text-gray-400'}>{address?.province} {address?.city} {address?.district} {address?.address}</View>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                </View>
                <View className={'bg-white p-4 rounded-lg mx-4 space-y-4'}>
                    <View className={'font-bold text-lg item-title'}>商品信息</View>
                    <View className={'space-y-4'}>
                        {detail.orderGoods.map((item: any) => {
                            return (
                                <View className={'flex space-x-2 items-center'}>
                                    <View className={'flex-none'}>
                                        <FallbackImage style={{width: 50, height: 50}} className={'rounded block'}
                                                       src={utils.resolveUrl(item.goodsImage)}/>
                                    </View>
                                    <View className={'flex-1'}>
                                        <View>{item.goodsName}</View>
                                        <View>{numeral(item.goodsPrice).format('0,0.00')} X {item.goodsCount}</View>
                                    </View>
                                    <View className={'flex flex-col space-y-2 items-center'}>
                                        <View className={'font-bold'}>￥{numeral(item.goodsPrice * item.goodsCount).format('0,0.00')}</View>
                                        {item.isAfter == 0 && detail.status > 1 && detail.type == 2 &&
                                            <Navigator style={{padding: 5, fontSize: 12}} className={'btn btn-outline'}
                                                       url={`after?ogid=${item.id}&oid=${item.orderId}`}>
                                                <View>申请售后</View>
                                            </Navigator>
                                        }
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    <View className={'text-right font-bold text-lg'}>总计：￥{numeral(detail.totalPrice).format('0,0.00')}</View>
                </View>

                {detail?.status == 2 &&
                    <View className={'bg-white p-4 rounded-lg m-4 space-y-4'}>
                        <View className={'font-bold text-lg item-title'}>快递信息</View>
                        <View className={'space-y-4'}>
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>快递类型</View>
                                <View>{detail.deliveryCode}</View>
                            </View>
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>快递单号</View>
                                <View>{detail.deliveryNo}</View>
                            </View>
                        </View>
                    </View>
                }
                <View className={'bg-white p-4 rounded-lg m-4 space-y-4'}>
                    <View className={'font-bold text-lg item-title'}>订单信息</View>
                    <View className={'space-y-4'}>
                        <View className={'flex items-center justify-between'}>
                            <View className={'text-gray-400'}>订单类型</View>
                            <View>{ORDER_TYPES[detail.type]}</View>
                        </View>
                        <View className={'flex items-center justify-between'}>
                            <View className={'text-gray-400'}>订单号</View>
                            <View>{detail.id}</View>
                        </View>
                        <View className={'flex items-center justify-between'}>
                            <View className={'text-gray-400'}>下单时间</View>
                            <View>{detail.createTime}</View>
                        </View>
                        <View className={'flex items-center justify-between'}>
                            <View className={'text-gray-400'}>支付时间</View>
                            <View>{detail.payTime}</View>
                        </View>
                        {detail.status > 0 && detail.payType == 1 &&
                        <View className={'flex items-center justify-between'}>
                            <View className={'text-gray-400'}>交易单号</View>
                            <View>{detail.transactionId}</View>
                        </View>
                        }
                        <View className={'flex items-center justify-between'}>
                            <View className={'text-gray-400'}>买家留言</View>
                            <View>{detail.note}</View>
                        </View>
                        {detail.status == 0 &&
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>支付方式</View>
                                <View>
                                    <Radio.Group defaultValue={detail.payType + ''} disabled={true} direction={'horizontal'} size={14} className={'radio-red-color'}
                                                 onChange={this.handlePayTypeChanged}>
                                        <Radio name={'1'}>微信支付</Radio>
                                        <Radio name={'2'}>网银转账</Radio>
                                    </Radio.Group>
                                </View>
                            </View>
                        }
                        {detail.status > 0 &&
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>支付方式</View>
                                <View>{detail.payType == 1 ? '微信支付': '网银转账'}</View>
                            </View>
                        }
                    </View>
                </View>
                {detail.status == 4 &&
                    <View className={'bg-white p-4 rounded-lg m-4 space-y-4'}>
                        <View className={'font-bold text-lg item-title'}>售后信息</View>
                        <View className={'space-y-4'}>
                            {afters?.map((item: any) => {
                                return (
                                    <View className={'flex space-x-2 items-center'}>
                                        <View className={'flex-none'}>
                                            <FallbackImage style={{width: 50, height: 50}} className={'rounded block'}
                                                           src={utils.resolveUrl(item.goodsImage)}/>
                                        </View>
                                        <View className={'flex-1'}>
                                            <View>{item.goodsName}</View>
                                            <View>{item.description}</View>
                                        </View>
                                        <View className={'flex flex-col space-y-2 items-center'}>
                                            <Button onClick={() => this.cancelAfter(item)} style={{padding: 5, fontSize: 12}}
                                                    className={'btn btn-outline'}>取消售后</Button>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                }

                <View className={'bg-white p-4 rounded-lg m-4 space-y-4'}>
                    <View className={'font-bold text-lg item-title'}>结算信息</View>
                    <View className={'space-y-4'}>
                        {detail.settlements.map((item: any) => {
                            return (
                                <View className={'flex items-center justify-between'}>
                                    <View className={'text-gray-400'}>{item.description}</View>
                                    <View className={'font-bold'}>{item.amount}</View>
                                </View>
                            );
                        })}
                        <View className={'flex items-center justify-between'}>
                            <View className={'text-gray-400'}>实际支付</View>
                            <View className={'font-bold text-lg text-red-600'}>￥{numeral(detail.payedPrice).format('0,0.00')}</View>
                        </View>
                    </View>
                </View>

                <View style={{height: 100}}></View>
                {this.renderButton()}

                <Popup style={{height: 330}} className={'!bg-gray-100'} open={openNetPay} rounded placement={'bottom'} onClose={() => this.setState({openNetPay: false})}>
                    <View className={'text-2xl'}>
                        <View className={'flex py-4 items-center justify-center text-xl font-bold'}>网银转账</View>
                        <Popup.Close/>
                    </View>
                    <View className={'px-4 space-y-4 flex flex-col justify-between'} style={{paddingBottom: 84}}>
                        <View className={'font-bold text-lg'}>平台对公银行账户:</View>
                        <View className={'divide-y'}>
                            {banks.map((item: any) => {
                                return (
                                    <View className={'flex'}>
                                        <View className={'flex-1 space-y-2'}>
                                            <View>{item.bankName}</View>
                                            <View>{item.bankAddress}</View>
                                            <View>{item.bankCode}</View>
                                        </View>
                                        <View className={'flex-none'}><Button className={'btn btn-sm btn-outline'} onClick={() => this.copyBank(item)}>复制</Button></View>
                                    </View>
                                );
                            })}
                        </View>
                        <View><TaroifyButton color={'primary'} block onClick={this.showUploadNetPay}>上传转账凭证</TaroifyButton></View>
                    </View>
                </Popup>
                <Popup style={{height: 330}} className={'!bg-gray-100'} open={openUploadPay} rounded placement={'bottom'} onClose={() => this.setState({openUploadPay: false})}>
                    <View className={'text-2xl'}>
                        <View className={'flex py-4 items-center justify-center text-xl font-bold'}>网银转账</View>
                        <Popup.Close/>
                    </View>
                    <View className={'px-4 space-y-4 flex flex-col justify-between'} style={{paddingBottom: 84}}>
                        <View className={''}><Text className={'font-bold text-lg'}>转账截图:</Text><Text className={'text-stone-400'}>图片大小不能超过5M</Text>:</View>
                        <View className={''}>
                            <Uploader onUpload={this.onUpload} onChange={this.setUploadFile} value={this.state.file}/>
                        </View>
                        <View><TaroifyButton block color={'danger'} onClick={this.confirmUpload}>确定</TaroifyButton></View>
                    </View>
                </Popup>
            </PageLayout>
        );
    }
}

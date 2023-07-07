import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {View, Navigator, Button, Text} from "@tarojs/components";
import NoData from "../../components/nodata";
import {connect} from "react-redux";
import Taro from "@tarojs/taro";

//@ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        page: 1,
        list: [],
        pageSize: 10,
        pages: 1,
    }

    constructor(props) {
        super(props);
        this.openWxServiceChat = this.openWxServiceChat.bind(this);
        this.makePhoneCall = this.makePhoneCall.bind(this);
        this.refreshLoad = this.refreshLoad.bind(this);
    }

    makePhoneCall() {
        const {settings} = this.props;
        Taro.makePhoneCall({phoneNumber: settings.servicePhone});
    }

    componentDidMount() {
    }

    openWxServiceChat() {
        const {wxServiceChatCorpId, wxServiceChatUrl} = this.props.settings;
        Taro.openCustomerServiceChat({
            extInfo: {url: wxServiceChatUrl},
            corpId: wxServiceChatCorpId,
        });
    }

    loadData(page) {
        const pageSize = this.state.pageSize;
        return request.get('/paimai/api/articles/list', {
            params: {
                pageNo: page,
                pageSize: pageSize,
                column: 'createTime',
                order: 'desc',
                type: 4,
            }
        }).then(res => {
            let records = res.data.result.records;
            if(records.length == 0) return;
            this.setState({list: records, pages: res.data.result.pages});
        });
    }

    refreshLoad() {
        let newPage = this.state.page + 1;
        if(newPage > this.state.pages) {
            newPage = 1;
        }
        utils.showLoading();
        this.setState({page: newPage});
        this.loadData(newPage).then(()=>utils.hideLoading());
    }

    onLoad(options: any) {
        this.setState({options: options})
        utils.showLoading();
        this.loadData(1).then(() => utils.hideLoading());
    }


    render() {
        const {list} = this.state;
        const {systemInfo, settings} = this.props;
        const safeBottom = utils.calcSafeBottom(systemInfo);
        return (
            <PageLayout statusBarProps={{title: '帮助中心', className: 'border-0 border-b-1 border-gray-200 bg-white border-solid'}}>
                <View className={'bg-white p-4 mt-4'}>
                    <View className={'flex items-center justify-between'}>
                        <View className={'item-title'}>常见问题</View>
                        <View className={'text-stone-400 cursor-pointer'} onClick={this.refreshLoad}><Text className={'fa fa-circle-o mr-2'}/>换一换</View>
                    </View>
                    {list.length == 0 && <NoData/>}
                    <View className={'grid grid-cols-1 mt-4 px-4'}>
                        {list.map((item) => {
                            return (
                                <View>
                                    <Navigator url={`/article/pages/detail?id=${item.id}`} className={'flex py-4 items-center'}>
                                        <View className={'text-red-700 mr-2'} style={{fontSize: 4}}>
                                            <Text className={'fa fa-circle'} />
                                        </View>
                                        <View className={'flex-1'}>
                                            {item.title}
                                        </View>
                                        <View className={'iconfont icon-youjiantou_huaban w-20 text-right'}/>
                                    </Navigator>
                                </View>
                            );
                        })}
                    </View>
                </View>
                <View className={'p-4 text-center absolute w-full'} style={{bottom: safeBottom}}>
                    <View className={'rounded-lg bg-orange-100 p-4'}>咨询时间：09:00 - 18:30 （工作日、节假日除外）</View>
                    <View className={'flex items-center mt-4'}>
                        <View className={'flex-1'}>
                            {!settings.wxServiceChatCorpId &&
                                <View className={''}>
                                    <Button className={'flex flex-col items-center justify-center'} plain={true} openType={'contact'}>
                                        <Text className={'iconfont !text-4xl icon-kefu011'} />
                                        在线咨询
                                    </Button>
                                </View>
                            }
                            {settings.wxServiceChatCorpId &&
                                <View className={''}>
                                    <Button className={'flex flex-col items-center justify-center'} plain={true} onClick={this.openWxServiceChat}>
                                        <Text className={'iconfont !text-4xl icon-kefu011'} />
                                        在线咨询
                                    </Button>
                                </View>
                            }
                        </View>
                        <View className={'flex-1'} onClick={this.makePhoneCall}>
                            <View className={'flex flex-col items-center justify-center'}>
                                <View className={'text-4xl'}>
                                    <Text className={'fa fa-phone'} />
                                </View>
                                <Button plain={true}>
                                    电话咨询
                                </Button>
                            </View>
                        </View>
                    </View>

                </View>
            </PageLayout>
        );
    }
}

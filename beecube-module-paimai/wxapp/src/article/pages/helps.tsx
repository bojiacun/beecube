import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {View, Navigator, Button, Text} from "@tarojs/components";
import NoData from "../../components/nodata";
import LoadMore from "../../components/loadmore";
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
        loadingMore: false,
        noMore: false,
    }

    constructor(props) {
        super(props);
        this.openWxServiceChat = this.openWxServiceChat.bind(this);
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
    loadData(page, clear = false) {
        return request.get('/paimai/api/articles/list', {
            params: {
                pageNo: page,
                column: 'createTime',
                order: 'desc',
                type: 4,
            }
        }).then(res => {
            if (clear) {
                this.setState({list: res.data.result.records, loadingMore: false, noMore: false});
            } else {
                let list = this.state.list;
                let newList = res.data.result.records;
                if (!newList || newList.length == 0) {
                    this.setState({noMore: true, loadingMore: false});
                } else {
                    this.setState({noMore: false, loadingMore: false, list: [...list, ...newList]});
                }
            }
        });
    }

    onLoad(options: any) {
        this.setState({options: options})
        utils.showLoading();
        this.loadData(1, true).then(() => utils.hideLoading());
    }


    render() {
        const {list, noMore, loadingMore} = this.state;
        const {systemInfo, settings} = this.props;
        const safeBottom = utils.calcSafeBottom(systemInfo) + 30;
        return (
            <PageLayout
                statusBarProps={{title: '帮助中心', className: 'border-0 border-b-1 border-gray-200 bg-white border-solid'}}
                enableReachBottom={true}>
                {list.length == 0 && <NoData/>}
                <View className={'grid grid-cols-1 divide-y divide-gray-100 px-4 bg-white'}>
                    {list.map((item) => {
                        return (
                            <View>
                                <Navigator url={`/article/pages/detail?id=${item.id}`} className={'bg-white py-4 flex items-center'}>
                                    <View className={'flex-1 font-bold'}>
                                        {item.title}
                                    </View>
                                    <View className={'iconfont icon-youjiantou_huaban w-20 text-right'}/>
                                </Navigator>
                            </View>
                        );
                    })}
                </View>
                <View className={'p-4 text-center absolute w-full'} style={{bottom:safeBottom}}>
                    {!settings.wxServiceChatCorpId &&
                        <Button className={'btn btn-outline text-lg'} openType={'contact'}><Text className={'fa fa-commenting-o mr-2'} />联系客服</Button>
                    }
                    {settings.wxServiceChatCorpId &&
                        <Button className={'btn btn-outline text-lg'} onClick={this.openWxServiceChat}><Text className={'fa fa-commenting-o mr-2'} />联系客服</Button>
                    }
                </View>
            </PageLayout>
        );
    }
}
